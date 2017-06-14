import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { feedsDefineNewCourseReviewMethod,
  feedsDefineNewOpportunityReviewMethod } from '../../../api/feed/FeedCollection.methods';
import { reviewsDefineMethod } from '../../../api/review/ReviewCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { reviewRatingsObjects } from '../shared/review-ratings';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Add_Review_Widget */

// TODO Slug should be auto-generated, student and reviewee should be dropdowns, Schema should have validators
// for Student, reviewType, reviewee.

const addSchema = new SimpleSchema({
  slug: { type: String, custom: FormUtils.slugFieldValidator },
  student: String,
  reviewType: String,
  reviewee: String,
  semester: String,
  rating: { type: Number, min: 0, max: 5 },
  comments: String,
  moderated: { type: String, optional: true },
  visible: { type: String, optional: true },
  moderatorComments: { type: String, optional: true },
}, { tracker: Tracker });

Template.Add_Review_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Review_Widget.helpers({
  semesters() {
    return Semesters.find({});
  },
  students() {
    return Users.find({});
  },
  reviewTypes() {
    return ['course', 'opportunity'];
  },
  ratings() {
    return reviewRatingsObjects;
  },
});

Template.Add_Review_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    newData.moderated = (newData.moderated === 'true');
    newData.visible = (newData.visible === 'true');
    if (instance.context.isValid()) {
      reviewsDefineMethod.call(newData, (error) => {
        if (error) {
          console.log('Error defining Review', error);
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
      let feedDefinition;
      if (newData.reviewType === 'course') {
        feedDefinition = {
          user: [newData.student],
          course: newData.reviewee,
          feedType: 'new-course-review',
        };
        feedsDefineNewCourseReviewMethod.call(feedDefinition);
      } else {
        feedDefinition = {
          user: [newData.student],
          opportunity: newData.reviewee,
          feedType: 'new-opportunity-review',
        };
        feedsDefineNewOpportunityReviewMethod.call(feedDefinition);
      }
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

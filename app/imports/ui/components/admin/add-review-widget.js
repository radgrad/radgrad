import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role.js';
import { Feeds } from '../../../api/feed/FeedCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { reviewRatingsObjects } from '../shared/review-ratings';
import * as FormUtils from '../form-fields/form-field-utilities.js';


// TODO Slug should be auto-generated, student and reviewee should be dropdowns, Schema should have validators
// for Student, reviewType, reviewee.

const addSchema = new SimpleSchema({
  user: String,
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
    return _.filter(Semesters.find({}, { sort: { semesterNumber: 1 } }).fetch(), s => !s.retired);
  },
  students() {
    const students = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(students, 'lastName');
    return sorted;
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
      FormUtils.renameKey(newData, 'user', 'student');
      defineMethod.call({ collectionName: 'ReviewCollection', definitionData: newData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
      let feedDefinition;
      if (newData.reviewType === 'course') {
        feedDefinition = { feedType: Feeds.NEW_COURSE_REVIEW, user: newData.student, course: newData.reviewee };
      }
      if (newData.reviewType === 'opportunity') {
        feedDefinition = {
          feedType: Feeds.NEW_OPPORTUNITY_REVIEW,
          user: newData.student,
          opportunity: newData.reviewee,
        };
      }
      defineMethod.call({ collectionName: Feeds.getCollectionName(), definitionData: feedDefinition });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

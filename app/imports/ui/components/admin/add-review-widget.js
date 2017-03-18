import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Feeds } from '../../../api/feed/FeedCollection';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

const addSchema = new SimpleSchema({
  slug: { type: String, optional: false, custom: FormUtils.slugFieldValidator },
  student: { type: String, optional: false },
  reviewType: { type: String, optional: false },
  reviewee: { type: String, optional: false },
  semester: { type: String, optional: false },
  rating: { type: Number, optional: false, min: 0, max: 5 },
  comments: { type: String, optional: false },
  moderated: { type: String, optional: true },
  visible: { type: String, optional: true },
  moderatorComments: { type: String, optional: true },
});

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
    return [{ score: 1, description: '1 (In general, this is one of the worst ICS ' +
    'courses/opportunities I have ever taken)' },
      { score: 2, description: '2 (In general, this is below average for an ICS course/opportunity)' },
      { score: 3, description: '3 (In general, this is an average ICS course/opportunity)' },
      { score: 4, description: '4 (In general, this is above average for an ICS course/opportunity)' },
      { score: 5, description: '5 (In general, this is one of the best ICS courses/opportunities I have ever taken)' }];
  },
});

Template.Add_Review_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.resetValidation();
    addSchema.clean(newData);
    instance.context.validate(newData);
    newData.moderated = (newData.moderated === 'true');
    newData.visible = (newData.visible === 'true');
    if (instance.context.isValid()) {
      Reviews.define(newData);
      FormUtils.indicateSuccess(instance, event);
      let feedDefinition;
      if (newData.reviewType === 'course') {
        feedDefinition = {
          user: [newData.student],
          course: newData.reviewee,
          feedType: 'new-course-review',
          timestamp: Date.now(),
        };
      } else {
        feedDefinition = {
          user: [newData.student],
          opportunity: newData.reviewee,
          feedType: 'new-opportunity-review',
          timestamp: Date.now(),
        };
      }
      Feeds.define(feedDefinition);
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

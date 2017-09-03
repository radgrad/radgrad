import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { Courses } from '../../../api/course/CourseCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

const addSchema = new SimpleSchema({
  name: String,
  slug: { type: String, custom: FormUtils.slugFieldValidator },
  shortName: { type: String, optional: true },
  number: String,
  creditHrs: { type: Number, optional: true, defaultValue: 3 },
  syllabus: { type: String, optional: true },
  description: String,
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  prerequisites: { type: Array },
  'prerequisites.$': String,
}, { tracker: Tracker });

Template.Add_Course_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Course_Widget.helpers({
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  courses() {
    return Courses.find({}, { sort: { number: 1 } });
  },
});

Template.Add_Course_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      defineMethod.call({ collectionName: Courses.getCollectionName(), definitionData: newData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
          // Add the feed call here so that we don't clutter feed when initializing database.
          const feedData = { feedType: Feeds.NEW_COURSE, course: newData.slug };
          defineMethod.call({ collectionName: Feeds.getCollectionName(), definitionData: feedData });
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

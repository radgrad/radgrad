import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { moment } from 'meteor/momentjs:moment';
import { Feeds } from '../../../api/feed/FeedCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  description: { type: String, optional: true },
  picture: { type: String, optional: true },
  // users: { type: Array }, 'users.$': String,
  opportunity: { type: String, optional: true },
  course: { type: String, optional: true },
  semester: { type: String, optional: true },
}, { tracker: Tracker });

Template.Update_Feed_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Feed_Widget.helpers({
  semesters() {
    return Semesters.find({}, { sort: { semesterNumber: 1 } });
  },
  feedTypes() {
    return [
      Feeds.NEW_COURSE,
      Feeds.NEW_OPPORTUNITY,
      Feeds.VERIFIED_OPPORTUNITY,
      Feeds.NEW_COURSE_REVIEW,
      Feeds.NEW_OPPORTUNITY_REVIEW,
      Feeds.NEW_USER,
      Feeds.NEW_LEVEL,
    ];
  },
  timestamp() {
    const feed = Feeds.findDoc(Template.currentData().updateID.get());
    return moment(feed.timestamp).format();
  },
  feed() {
    return Feeds.findDoc(Template.currentData().updateID.get());
  },
  opportunities() {
    return Opportunities.find({}, { sort: { name: 1 } });
  },
  courses() {
    return Courses.find({}, { sort: { number: 1 } });
  },
});

Template.Update_Feed_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: Feeds.getCollectionName(), updateData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});

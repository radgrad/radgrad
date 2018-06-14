import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role.js';
import { Feeds } from '../../../api/feed/FeedCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Courses } from '../../../api/course/CourseCollection';


const addSchema = new SimpleSchema({
  feedType: String,
  timestamp: { type: Date, optional: true },
  description: { type: String, optional: true },
  picture: { type: String, optional: true },
  // users: { type: Array }, 'users.$': String,
  opportunity: { type: String, optional: true },
  course: { type: String, optional: true },
  semester: { type: String, optional: true },
}, { tracker: Tracker });

Template.Add_Feed_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Feed_Widget.helpers({
  students() {
    const students = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(students, 'lastName');
    return sorted;
  },
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
  opportunities() {
    return Opportunities.find({}, { sort: { name: 1 } });
  },
  courses() {
    return Courses.find({}, { sort: { number: 1 } });
  },
});

Template.Add_Feed_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      defineMethod.call({ collectionName: 'FeedCollection', definitionData: newData }, (error) => {
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
});

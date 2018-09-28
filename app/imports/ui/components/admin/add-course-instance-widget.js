import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Courses } from '../../../api/course/CourseCollection';
import { Users } from '../../../api/user/UserCollection';
import { ROLE } from '../../../api/role/Role.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';

const addSchema = new SimpleSchema({
  semester: String,
  course: String,
  verified: String,
  fromSTAR: String,
  grade: String,
  note: { type: String, optional: true },
  user: String,
}, { tracker: Tracker });

Template.Add_Course_Instance_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Course_Instance_Widget.helpers({
  semesters() {
    return Semesters.find({}, { sort: { semesterNumber: 1 } });
  },
  students() {
    const students = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(students, student => Users.getFullName(student.username));
    return sorted;
  },
  courses() {
    return Courses.find({}, { sort: { number: 1 } });
  },
});

Template.Add_Course_Instance_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid() &&
        !CourseInstances.isCourseInstance(newData.semester, newData.course, newData.user)) {
      FormUtils.convertICE(newData);
      newData.verified = (newData.verified === 'true');
      newData.fromSTAR = (newData.fromSTAR === 'true');
      if (!newData.note) {
        newData.note = Courses.findDoc(newData.course).number;
      }
      FormUtils.renameKey(newData, 'user', 'student');
      defineMethod.call({ collectionName: 'CourseInstanceCollection', definitionData: newData }, (error) => {
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

import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Roles } from 'meteor/alanning:roles';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { courseInstancesDefineMethod } from '../../../api/course/CourseInstanceCollection.methods';
import { Courses } from '../../../api/course/CourseCollection';
import { ROLE } from '../../../api/role/Role.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Add_Course_Instance_Widget */


const addSchema = new SimpleSchema({
  semester: { type: String, optional: false },
  course: { type: String, optional: false },
  verified: { type: String, optional: false },
  fromSTAR: { type: String, optional: false },
  grade: { type: String, optional: false },
  note: { type: String, optional: true },
  user: { type: String, optional: false },
});

Template.Add_Course_Instance_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Course_Instance_Widget.helpers({
  semesters() {
    return Semesters.find({});
  },
  students() {
    const students = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(students, 'lastName');
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
    instance.context.resetValidation();
    addSchema.clean(newData);
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
      courseInstancesDefineMethod.call(newData, (error) => {
        if (error) {
          console.log('Error could not define CourseInstance', error);
          FormUtils.indicateError(instance);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

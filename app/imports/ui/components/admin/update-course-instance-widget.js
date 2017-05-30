import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { courseInstancesUpdateMethod } from '../../../api/course/CourseInstanceCollection.methods';
import { ROLE } from '../../../api/role/Role.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Update_Course_Instance_Widget */

const updateSchema = new SimpleSchema({
  semester: { type: String, optional: false },
  course: { type: String, optional: false },
  verified: { type: String, optional: false },
  fromSTAR: { type: String, optional: false },
  grade: { type: String, optional: false },
  creditHrs: { type: String, optional: false },
  note: { type: String, optional: false },
  user: { type: String, optional: false },
  innovation: { type: Number, optional: false, min: 0, max: 100 },
  competency: { type: Number, optional: false, min: 0, max: 100 },
  experience: { type: Number, optional: false, min: 0, max: 100 },
});

Template.Update_Course_Instance_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Course_Instance_Widget.helpers({
  semesters() {
    return Semesters.find({});
  },
  students() {
    const students = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(students, 'lastName');
    return sorted;
  },
  courseInstance() {
    const ci = CourseInstances.findDoc(Template.currentData().updateID.get());
    return ci;
  },
  selectedSemesterID() {
    const course = CourseInstances.findDoc(Template.currentData().updateID.get());
    return course.semesterID;
  },
  trueValueVerified() {
    const course = CourseInstances.findDoc(Template.currentData().updateID.get());
    return course.verified;
  },
  falseValueVerified() {
    const course = CourseInstances.findDoc(Template.currentData().updateID.get());
    return !course.verified;
  },
  trueValueFromSTAR() {
    const course = CourseInstances.findDoc(Template.currentData().updateID.get());
    return course.fromSTAR;
  },
  falseValueFromSTAR() {
    const course = CourseInstances.findDoc(Template.currentData().updateID.get());
    return !course.fromSTAR;
  },
  courses() {
    return Courses.find({}, { sort: { number: 1 } });
  },
  course() {
    const course = CourseInstances.findDoc(Template.currentData().updateID.get());
    return course.courseID;
  },
});

Template.Update_Course_Instance_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updatedData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.resetValidation();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    // TODO update doesn't work.
    if (instance.context.isValid() &&
        !CourseInstances.isCourseInstance(updatedData.semester, updatedData.course, updatedData.user)) {
      FormUtils.convertICE(updatedData);
      updatedData.verified = (updatedData.verified === 'true');
      updatedData.fromSTAR = (updatedData.fromSTAR === 'true');
      FormUtils.renameKey(updatedData, 'semester', 'semesterID');
      FormUtils.renameKey(updatedData, 'course', 'courseID');
      FormUtils.renameKey(updatedData, 'user', 'studentID');
      updatedData.id = instance.data.updateID.get();
      courseInstancesUpdateMethod.call(updatedData, (error) => {
        if (error) {
          console.log('Error could not update CourseInstance', error);
          FormUtils.indicateError(instance);
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

import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { ROLE } from '../../../api/role/Role.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';

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
    return Roles.getUsersInRole([ROLE.STUDENT]);
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
    return Courses.find().fetch();
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
    if (instance.context.isValid()) {
      FormUtils.convertICE(updatedData);
      updatedData.verified = (updatedData.verified === 'true');
      updatedData.fromSTAR = (updatedData.fromSTAR === 'true');
      FormUtils.renameKey(updatedData, 'semester', 'semesterID');
      FormUtils.renameKey(updatedData, 'course', 'courseID');
      FormUtils.renameKey(updatedData, 'user', 'studentID');
      CourseInstances.update(instance.data.updateID.get(), { $set: updatedData });
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});

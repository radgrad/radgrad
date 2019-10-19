import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROLE } from '../../../api/role/Role.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  semester: String,
  course: String,
  verified: String,
  fromSTAR: String,
  grade: String,
  creditHrs: String,
  note: String,
  student: String,
  innovation: {
    type: Number, optional: false, min: 0, max: 100,
  },
  competency: {
    type: Number, optional: false, min: 0, max: 100,
  },
  experience: {
    type: Number, optional: false, min: 0, max: 100,
  },
  retired: Boolean,
}, { tracker: Tracker });

Template.Update_Course_Instance_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Course_Instance_Widget.helpers({
  semesters() {
    return Semesters.findNonRetired({}, { sort: { semesterNumber: 1 } });
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
    return Courses.findNonRetired({}, { sort: { number: 1 } });
  },
  course() {
    const course = CourseInstances.findDoc(Template.currentData().updateID.get());
    return course.courseID;
  },
  falseValueRetired() {
    const plan = CourseInstances.findDoc(Template.currentData()
      .updateID
      .get());
    return !plan.retired;
  },
  trueValueRetired() {
    const plan = CourseInstances.findDoc(Template.currentData()
      .updateID
      .get());
    return plan.retired;
  },
});

Template.Update_Course_Instance_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    updateData.retired = updateData.retired === 'true';
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      FormUtils.convertICE(updateData);
      updateData.verified = (updateData.verified === 'true');
      updateData.fromSTAR = (updateData.fromSTAR === 'true');
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: 'CourseInstanceCollection', updateData }, (error) => {
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

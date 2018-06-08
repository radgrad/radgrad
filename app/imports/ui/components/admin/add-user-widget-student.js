import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';

const addSchema = new SimpleSchema({
  academicPlan: { type: String, optional: true },
  declaredSemester: { type: String, optional: true },
}, { tracker: Tracker });

Template.Add_User_Widget_Student.onCreated(function addUserWidgetStudentOnCreated() {
  FormUtils.setupFormWidget(this, addSchema);// add your statement here
});

Template.Add_User_Widget_Student.helpers({
  semesters() {
    return Semesters.find({}, { sort: { semesterNumber: -1 } });
  },
  plans() {
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const year = currentSemester.term === Semesters.FALL ? currentSemester.year : currentSemester.year - 1;
    const lastFallID = Semesters.define({ term: Semesters.FALL, year });
    const semesterNum = Semesters.findDoc(lastFallID).semesterNumber;
    return AcademicPlans.find({ semesterNumber: { $gte: semesterNum } }).fetch();
  },
});

Template.Add_User_Widget_Student.events({
  // add your events here
});

Template.Add_User_Widget_Student.onRendered(function addUserWidgetStudentOnRendered() {
  // add your statement here
});

Template.Add_User_Widget_Student.onDestroyed(function addUserWidgetStudentOnDestroyed() {
  // add your statement here
});


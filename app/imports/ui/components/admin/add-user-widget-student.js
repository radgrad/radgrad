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
    return Semesters.findNonRetired({}, { sort: { semesterNumber: -1 } });
  },
  plans() {
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const year = currentSemester.term === Semesters.FALL ? currentSemester.year : currentSemester.year - 1;
    const lastFallID = Semesters.define({ term: Semesters.FALL, year });
    const semesterNum = Semesters.findDoc(lastFallID).semesterNumber;
    return AcademicPlans.findNonRetired({ semesterNumber: { $gte: semesterNum } });
  },
});

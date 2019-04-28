import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';

const addSchema = new SimpleSchema({
  academicPlan: { type: String, optional: true },
  isAlumni: String,
  declaredSemester: { type: String, optional: true },
}, { tracker: Tracker });

Template.Update_User_Widget_Student.onCreated(function addUserWidgetStudentOnCreated() {
  FormUtils.setupFormWidget(this, addSchema);// add your statement here
});

Template.Update_User_Widget_Student.helpers({
  calcLevel() {
    if (Template.currentData().user) {
      return Template.currentData().user.level;
    }
    return 0;
  },
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
  selectedSemester() {
    return Template.currentData().user.declaredSemesterID;
  },
  selectedPlan() {
    return Template.currentData().user.academicPlanID
        && AcademicPlans.findDoc(Template.currentData().user.academicPlanID).name;
  },
  falseValueAlumni() {
    return !Template.currentData().user.isAlumni;
  },
  trueValueAlumni() {
    return Template.currentData().user.isAlumni;
  },
  trueValueUsername() {
    return Template.currentData().user.shareUsername;
  },
  falseValueUsername() {
    return !Template.currentData().user.shareUsername;
  },
  trueValuePicture() {
    return Template.currentData().user.sharePicture;
  },
  falseValuePicture() {
    return !Template.currentData().user.sharePicture;
  },
  trueValueWebsite() {
    return Template.currentData().user.shareWebsite;
  },
  falseValueWebsite() {
    return !Template.currentData().user.shareWebsite;
  },
  trueValueCareerGoals() {
    return Template.currentData().user.shareCareerGoals;
  },
  falseValueCareerGoals() {
    return !Template.currentData().user.shareCareerGoals;
  },
  trueValueInterests() {
    return Template.currentData().user.shareInterests;
  },
  falseValueInterests() {
    return !Template.currentData().user.shareInterests;
  },
  trueValueAcademicPlan() {
    return Template.currentData().user.shareAcademicPlan;
  },
  falseValueAcademicPlan() {
    return !Template.currentData().user.shareAcademicPlan;
  },
  trueValueCourses() {
    return Template.currentData().user.shareCourses;
  },
  falseValueCourses() {
    return !Template.currentData().user.shareCourses;
  },
  trueValueOpportunities() {
    return Template.currentData().user.shareOpportunities;
  },
  falseValueOpportunities() {
    return !Template.currentData().user.shareOpportunities;
  },
  trueValueLevel() {
    return Template.currentData().user.shareLevel;
  },
  falseValueLevel() {
    return !Template.currentData().user.shareLevel;
  },
});

Template.Update_User_Widget_Student.events({
  // add your events here
});

Template.Update_User_Widget_Student.onRendered(function addUserWidgetStudentOnRendered() {
  // add your statement here
});

Template.Update_User_Widget_Student.onDestroyed(function addUserWidgetStudentOnDestroyed() {
  // add your statement here
});


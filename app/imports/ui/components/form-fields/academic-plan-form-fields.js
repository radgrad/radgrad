import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Academic_Plan_Form_Fields.onCreated(function academicPlanFormFieldsOnCreated() {
  this.chosenYear = new ReactiveVar('');
});

Template.Academic_Plan_Form_Fields.helpers({
  isSelected(semesterID, selectedSemesterID) {
    return selectedSemesterID === semesterID;
  },
  selectedPlan() {
    const profile = Users.getProfile(Template.currentData().userID.get());
    if (profile.academicPlanID) {
      return AcademicPlans.findDoc(profile.academicPlanID).name;
    }
    return '';
  },
  selectedYear() {
    const profile = Users.getProfile(Template.currentData().userID.get());
    if (profile.academicPlanID) {
      const plan = AcademicPlans.findDoc(profile.academicPlanID);
      const semester = Semesters.findDoc(plan.effectiveSemesterID);
      return semester.year;
    }
    return '';
  },
  plans() {
    if (Template.currentData().userID.get()) {
      const profile = Users.getProfile(Template.currentData().userID.get());
      if (profile.academicPlanID) {
        const plan = AcademicPlans.findDoc(profile.academicPlanID);
        const semester = Semesters.findDoc(plan.effectiveSemesterID);
        let plans = AcademicPlans.findNonRetired();
        plans = _.filter(plans, (p) => {
          const year = Semesters.findDoc(p.effectiveSemesterID).year;
          return semester.year === year;
        });
        return _.sortBy(plans, [function sort(o) {
          return o.name;
        }]);
      }
      const chosen = parseInt(Template.instance().chosenYear.get(), 10);
      let plans = AcademicPlans.findNonRetired();
      plans = _.filter(plans, (p) => {
        const year = Semesters.findDoc(p.effectiveSemesterID).year;
        return chosen === year;
      });
      return _.sortBy(plans, [function sort(o) {
        return o.name;
      }]);
    }
    return '';
  },
  years() {
    if (Template.currentData().userID.get()) {
      const profile = Users.getProfile(Template.currentData().userID.get());
      let declaredYear;
      if (profile.declaredSemesterID) {
        declaredYear = Semesters.findDoc(profile.declaredSemesterID).year;
      }
      let plans = AcademicPlans.findNonRetired();
      plans = _.filter(plans, (p) => {
        const year = Semesters.findDoc(p.effectiveSemesterID).year;
        if (declaredYear) {
          return year >= declaredYear;
        }
        return true;
      });
      let years = _.map(plans, (p) => Semesters.findDoc(p.effectiveSemesterID).year);
      years = _.uniq(years);
      return _.sortBy(years, [function sort(o) {
        return o;
      }]);
    }
    return '';
  },
});

Template.Academic_Plan_Form_Fields.events({
  'change [name=year]': function changeYear(event) {
    event.preventDefault();
    Template.instance().chosenYear.set($(event.target).val());
  },
});

Template.Academic_Plan_Form_Fields.onRendered(function academicPlanFormFieldsOnRendered() {
  this.$('.dropdown').dropdown();
});

Template.Academic_Plan_Form_Fields.onDestroyed(function academicPlanFormFieldsOnDestroyed() {
  // add your statement here
});


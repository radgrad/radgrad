import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicPlans } from '../../../../api/degree-plan/AcademicPlanCollection';
import { Semesters } from '../../../../api/semester/SemesterCollection.js';
import { Users } from '../../../../api/user/UserCollection.js';

Template.Academic_Plan_Form_Fields.onCreated(function academicPlanFormFieldsOnCreated() {
  this.chosenYear = new ReactiveVar('');
});

Template.Academic_Plan_Form_Fields.helpers({
  isSelected(semesterID, selectedSemesterID) {
    return selectedSemesterID === semesterID;
  },
  selectedPlan() {
    const user = Users.findDoc(Template.currentData().userID.get());
    if (user.academicPlanID) {
      return AcademicPlans.findDoc(user.academicPlanID).name;
    }
    return '';
  },
  selectedYear() {
    const user = Users.findDoc(Template.currentData().userID.get());
    if (user.academicPlanID) {
      const plan = AcademicPlans.findDoc(user.academicPlanID);
      const semester = Semesters.findDoc(plan.effectiveSemesterID);
      return semester.year;
    }
    return '';
  },
  plans() {
    if (Template.currentData().userID.get()) {
      const user = Users.findDoc(Template.currentData().userID.get());
      if (user.academicPlanID) {
        const plan = AcademicPlans.findDoc(user.academicPlanID);
        const semester = Semesters.findDoc(plan.effectiveSemesterID);
        let plans = AcademicPlans.find().fetch();
        plans = _.filter(plans, (p) => {
          const year = Semesters.findDoc(p.effectiveSemesterID).year;
          return semester.year === year;
        });
        return _.sortBy(plans, [function sort(o) {
          return o.name;
        }]);
      }
      const chosen = parseInt(Template.instance().chosenYear.get(), 10);
      let plans = AcademicPlans.find().fetch();
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
      const student = Users.findDoc(Template.currentData().userID.get());
      let declaredYear;
      if (student.declaredSemesterID) {
        declaredYear = Semesters.findDoc(student.declaredSemesterID).year;
      }
      let plans = AcademicPlans.find().fetch();
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


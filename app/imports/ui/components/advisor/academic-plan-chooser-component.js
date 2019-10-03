import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { Roles } from 'meteor/alanning:roles';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { ROLE } from '../../../api/role/Role';
import { updateAcademicPlanMethod } from '../../../api/user/UserCollection.methods';

Template.Academic_Plan_Chooser_Component.onCreated(function academicPlanChooserComponentOnCreated() {
  // console.log(this.data);
  this.chosenYear = new ReactiveVar('');
  this.plan = this.data.plan;
});

Template.Academic_Plan_Chooser_Component.helpers({
  names() {
    const chosen = parseInt(Template.instance()
      .chosenYear
      .get(), 10);
    const plans = AcademicPlans.findNonRetired();
    let name = _.filter(plans, (p) => {
      const year = Semesters.findDoc(p.effectiveSemesterID).year;
      return chosen === year;
    });
    name = _.map(name, (n) => n.name);
    return _.sortBy(name, [function sort(o) {
      return o;
    }]);
  },
  selectedName() {
    if (Template.instance()
      .plan
      .get()) {
      return Template.instance()
        .plan
        .get().name;
    }
    return '';
  },
  selectedYear() {
    if (Template.instance()
      .plan
      .get()) {
      const plan = Template.instance()
        .plan
        .get();
      const semester = Semesters.findDoc(plan.effectiveSemesterID);
      Template.instance()
        .chosenYear
        .set(semester.year);
      return semester.year;
    }
    return '';
  },
  years() {
    if (getUserIdFromRoute()) {
      const studentID = getUserIdFromRoute();
      const profile = Users.getProfile(studentID);
      let declaredYear;
      if (profile.declaredSemesterID) {
        const decSem = Semesters.findDoc(profile.declaredSemesterID);
        declaredYear = decSem.year;
      }
      let plans = AcademicPlans.findNonRetired();
      plans = _.uniqBy(plans, (p) => Semesters.findDoc(p.effectiveSemesterID).year);
      plans = _.filter(plans, (p) => {
        const year = Semesters.findDoc(p.effectiveSemesterID).year;
        if (declaredYear && year >= declaredYear) {
          return true;
        } else if (!declaredYear) {
          return true;
        }
        return false;
      });
      const years = _.map(plans, (p) => Semesters.findDoc(p.effectiveSemesterID).year);
      return _.sortBy(years, [function sort(o) {
        return o;
      }]);
    }
    return [];
  },
});

Template.Academic_Plan_Chooser_Component.events({
  'change [name=year]': function changeYear(event) {
    event.preventDefault();
    Template.instance()
      .chosenYear
      .set($(event.target)
        .val());
  },
  'change [name=name]': function changePlan(event) {
    event.preventDefault();
    const year = Template.instance()
      .chosenYear
      .get();
    const semesterSlug = `Fall-${year}`;
    const effectiveSemesterID = Slugs.getEntityID(semesterSlug, 'Semester');
    const name = $(event.target)
      .val();
    const plan = AcademicPlans.findDoc({ effectiveSemesterID, name });
    Template.instance()
      .plan
      .set(plan);
    if (getUserIdFromRoute()) {
      if (Roles.userIsInRole(getUserIdFromRoute(), ROLE.STUDENT)) {
        const updateData = {};
        updateData.id = getUserIdFromRoute();
        updateData.academicPlan = plan._id;
        updateAcademicPlanMethod.call(plan._id, (error) => {
          if (error) {
            console.log('Error updating student\' academic plan', error);
          } else {
            // FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
          }
        });
      }
    }
  },
});

Template.Academic_Plan_Chooser_Component.onRendered(function academicPlanChooserComponentOnRendered() {
  this.$('.dropdown')
    .dropdown({
      // action: 'select',
    });
});

Template.Academic_Plan_Chooser_Component.onDestroyed(function academicPlanChooserComponentOnDestroyed() {
  // add your statement here
});


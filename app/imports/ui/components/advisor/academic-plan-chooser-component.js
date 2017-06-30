import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { Roles } from 'meteor/alanning:roles';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { ROLE } from '../../../api/role/Role';

// /** @module ui/components/advisor/Academic_Plan_Chooser_Component */

Template.Academic_Plan_Chooser_Component.onCreated(function academicPlanChooserComponentOnCreated() {
  // console.log(this.data);
  this.chosenYear = new ReactiveVar('');
  this.plan = this.data.plan;
});

Template.Academic_Plan_Chooser_Component.helpers({
  names() {
    const chosen = parseInt(Template.instance().chosenYear.get(), 10);
    const plans = AcademicPlans.find().fetch();
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
    if (Template.instance().plan.get()) {
      return Template.instance().plan.get().name;
    }
    return '';
  },
  selectedYear() {
    if (Template.instance().plan.get()) {
      const plan = Template.instance().plan.get();
      const semester = Semesters.findDoc(plan.effectiveSemesterID);
      Template.instance().chosenYear.set(semester.year);
      return semester.year;
    }
    return '';
  },
  years() {
    const studentID = getUserIdFromRoute();
    const student = Users.findDoc({ _id: studentID });
    let declaredYear;
    if (student.declaredSemesterID) {
      const decSem = Semesters.findDoc(student.declaredSemesterID);
      declaredYear = decSem.year;
    }
    let plans = AcademicPlans.find().fetch();
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
  },
});

Template.Academic_Plan_Chooser_Component.events({
  'change [name=year]': function changeYear(event) {
    event.preventDefault();
    Template.instance().chosenYear.set($(event.target).val());
  },
  'change [name=name]': function changeYear(event) {
    event.preventDefault();
    const year = Template.instance().chosenYear.get();
    const semesterSlug = `Fall-${year}`;
    const effectiveSemesterID = Slugs.getEntityID(semesterSlug, 'Semester');
    const name = $(event.target).val();
    const plan = AcademicPlans.findDoc({ effectiveSemesterID, name });
    Template.instance().plan.set(plan);
    if (Roles.userIsInRole(getUserIdFromRoute(), ROLE.STUDENT)) {
      const user = Users.findDoc(getUserIdFromRoute());
      const updateData = {};
      updateData.id = user._id;
      updateData.academicPlan = plan._id;
      const collectionName = Users.getCollectionName();
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.log('Error updating student\' academic plan', error);
        }
      });
    }
  },
});

Template.Academic_Plan_Chooser_Component.onRendered(function academicPlanChooserComponentOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

Template.Academic_Plan_Chooser_Component.onDestroyed(function academicPlanChooserComponentOnDestroyed() {
  // add your statement here
});


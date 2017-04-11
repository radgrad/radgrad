import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { AcademicPlans } from '../../../api/degree/AcademicPlanCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

Template.Academic_Plan_Chooser_Widget.onCreated(function academicPlanChooserWidgetOnCreated() {
  this.chosenYear = new ReactiveVar('');
  this.plan = this.data.plan;
});

Template.Academic_Plan_Chooser_Widget.helpers({
  years() {
    const ret = [];
    const plans = AcademicPlans.find().fetch();
    _.map(plans, (p) => {
      const year = Semesters.findDoc(p.effectiveSemesterID).year;
      if (_.indexOf(ret, year) === -1) {
        ret.push(year);
      }
    });
    return _.sortBy(ret, [function sort(o) { return o; }]);
  },
  names() {
    const ret = [];
    const chosen = parseInt(Template.instance().chosenYear.get(), 10);
    const plans = AcademicPlans.find().fetch();
    _.map(plans, (p) => {
      const year = Semesters.findDoc(p.effectiveSemesterID).year;
      if (chosen === year) {
        ret.push(p.name);
      }
    });
    return _.sortBy(ret, [function sort(o) { return o; }]);
  },
});

Template.Academic_Plan_Chooser_Widget.events({
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
    console.log(plan);
    Template.instance().plan.set(plan);
  },
});

Template.Academic_Plan_Chooser_Widget.onRendered(function academicPlanChooserWidgetOnRendered() {
  // add your statement here
});

Template.Academic_Plan_Chooser_Widget.onDestroyed(function academicPlanChooserWidgetOnDestroyed() {
  // add your statement here
});


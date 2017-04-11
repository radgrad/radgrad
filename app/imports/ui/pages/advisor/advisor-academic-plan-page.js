import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Advisor_Academic_Plan_Page.onCreated(function advisorAcademicPlanPageOnCreated() {
  this.plan = new ReactiveVar('');
});

Template.Advisor_Academic_Plan_Page.helpers({
  getPlan() {
    return Template.instance().plan;
  },
});

Template.Advisor_Academic_Plan_Page.events({
  // add your events here
});

Template.Advisor_Academic_Plan_Page.onRendered(function advisorAcademicPlanPageOnRendered() {
  Template.instance().$('.menu .item').tab();
});

Template.Advisor_Academic_Plan_Page.onDestroyed(function advisorAcademicPlanPageOnDestroyed() {
  // add your statement here
});

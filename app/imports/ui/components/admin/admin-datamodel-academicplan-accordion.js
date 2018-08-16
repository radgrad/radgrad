import { Template } from 'meteor/templating';
import { Showdown } from 'meteor/markdown';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Admin_Datamodel_Academicplan_Accordion.onCreated(function admindatamodelacademicplanaccordionOnCreated() {
  this.plan = new ReactiveVar('');
  if (this.data.academicPlan) {
    this.plan.set(this.data.academicPlan);
  }
});

Template.Admin_Datamodel_Academicplan_Accordion.onRendered(function listCareerGoalsWidgetOnRendered() {
  this.$('.ui.accordion').accordion();
});


/* eslint-disable new-cap */

Template.Admin_Datamodel_Academicplan_Accordion.helpers({
  getPlan() {
    return Template.instance().plan;
  },
  markdownify(obj) {
    return (typeof obj === 'string') ? new Showdown.converter().makeHtml(obj) : obj;
  },
});

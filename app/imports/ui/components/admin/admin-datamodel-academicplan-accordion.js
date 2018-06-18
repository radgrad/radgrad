import { Template } from 'meteor/templating';
import { Showdown } from 'meteor/markdown';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Admin_Datamodel_Academicplan_Accordion.onCreated(function admindatamodelacademicplanaccordionOnCreated() {
  this.plan = new ReactiveVar('');
  console.log('acc', this.data);
  if (this.data.academicPlan) {
    this.plan.set(this.data.academicPlan);
  }
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

Template.Admin_Datamodel_Academicplan_Accordion.events({
  // add your events here
});

Template.Admin_Datamodel_Academicplan_Accordion.onRendered(function admindatamodelacademicplanaccordionOnRendered() {
  this.$('.ui.accordion').accordion();
});

Template.Admin_Datamodel_Academicplan_Accordion.onDestroyed(function admindatamodelacademicplanaccordionOnDestroyed() {
  // add your statement here
});


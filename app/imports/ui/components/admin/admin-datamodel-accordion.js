import { Template } from 'meteor/templating';
import { Showdown } from 'meteor/markdown';

Template.Admin_DataModel_Accordion.onRendered(function listCareerGoalsWidgetOnRendered() {
  this.$('.ui.accordion').accordion();
});

/* eslint-disable new-cap */

Template.Admin_DataModel_Accordion.helpers({
  markdownify(obj) {
    return (typeof obj === 'string') ? new Showdown.converter().makeHtml(obj) : obj;
  },
});

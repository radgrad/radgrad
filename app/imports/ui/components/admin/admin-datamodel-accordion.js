import { Template } from 'meteor/templating';

Template.Admin_DataModel_Accordion.onRendered(function listCareerGoalsWidgetOnRendered() {
  this.$('.ui.accordion').accordion();
});

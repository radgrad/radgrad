import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

/* eslint-disable max-len */

Template.Admin_DataModel_Advisor_Logs_Page.onCreated(function adminDataModelAdvisorLogsPageOnCreated() {
  this.updateID = new ReactiveVar('');
});

Template.Admin_DataModel_Advisor_Logs_Page.helpers({
  updateID() {
    return Template.instance().updateID;
  },
  displayUpdateWidget() {
    return Template.instance().updateID.get();
  },
});

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Admin_DataModel_DesiredDegrees_Page.onCreated(function adminDataModelDesiredDegreespageOnCreated() {
  this.updateID = new ReactiveVar('');
});

Template.Admin_DataModel_DesiredDegrees_Page.helpers({
  updateID() {
    return Template.instance().updateID;
  },
  displayUpdateWidget() {
    return Template.instance().updateID.get();
  },
});

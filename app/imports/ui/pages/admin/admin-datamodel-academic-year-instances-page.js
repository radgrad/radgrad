import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

/* eslint-disable max-len */

Template.Admin_DataModel_Academic_Year_Instances_Page.onCreated(function adminDataModelAcademicYearInstancesPageOnCreated() {
  this.updateID = new ReactiveVar('');
});

Template.Admin_DataModel_Academic_Year_Instances_Page.helpers({
  updateID() {
    return Template.instance().updateID;
  },
  displayUpdateWidget() {
    return Template.instance().updateID.get();
  },
});

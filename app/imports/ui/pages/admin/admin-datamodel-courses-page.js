import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Admin_DataModel_Courses_Page.helpers({
  updateID() {
    return Template.instance().updateID;
  },
  displayUpdateWidget() {
    return Template.instance().updateID.get();
  },
});

Template.Admin_DataModel_Courses_Page.onCreated(function onCreated() {
  this.updateID = new ReactiveVar('');
});

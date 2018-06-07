import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Admin_DataModel_Mentor_Questions_Page.helpers({
  updateID() {
    return Template.instance().updateID;
  },
  displayUpdateWidget() {
    return Template.instance().updateID.get();
  },
});

Template.Admin_DataModel_Mentor_Questions_Page.onCreated(function adminDatamodelMentorQuestionPageOnCreated() {
  this.updateID = new ReactiveVar('');
});

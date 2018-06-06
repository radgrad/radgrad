import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Admin_DataModel_Mentor_Answer_Page.helpers({
  updateID() {
    return Template.instance().updateID;
  },
  displayUpdateWidget() {
    return Template.instance().updateID.get();
  },
});

Template.Admin_DataModel_Mentor_Answer_Page.onCreated(function adminDatamodelMentorAnswerPageOnCreated() {
  this.updateID = new ReactiveVar('');
});

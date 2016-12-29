import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Admin_DataModel_HelpMessages_Page.helpers({
  updateID() {
    return Template.instance().updateID;
  },
  displayUpdateWidget() {
    return Template.instance().updateID.get();
  },
});

Template.Admin_DataModel_HelpMessages_Page.onCreated(function adminCrudPageOnCreated() {
  this.updateID = new ReactiveVar('');
});


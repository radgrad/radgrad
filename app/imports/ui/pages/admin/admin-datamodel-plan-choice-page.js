import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Admin_DataModel_Plan_Choice_Page.onCreated(function adminDatamodelPlanChoicePageOnCreated() {
  this.updateID = new ReactiveVar('');
});

Template.Admin_DataModel_Plan_Choice_Page.helpers({
  updateID() {
    return Template.instance().updateID;
  },
  displayUpdateWidget() {
    return Template.instance().updateID.get();
  },
});

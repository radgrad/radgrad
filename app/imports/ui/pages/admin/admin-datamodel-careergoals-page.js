import { Template } from 'meteor/templating';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Admin_DataModel_CareerGoals_Page.helpers({
  updateID() {
    return Template.instance().updateID;
  },
  displayUpdateWidget() {
    return Template.instance().updateID.get();
  },
});

Template.Admin_DataModel_CareerGoals_Page.events({
  // add your events here
});

Template.Admin_DataModel_CareerGoals_Page.onCreated(function adminCrudPageOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.updateID = new ReactiveVar('');
});

Template.Admin_DataModel_CareerGoals_Page.onRendered(function adminDataModelPageOnRendered() {
  this.$('.dropdown').dropdown({});
});

Template.Admin_DataModel_CareerGoals_Page.onDestroyed(function adminCrudPageOnDestroyed() {
  // add your statement here
});


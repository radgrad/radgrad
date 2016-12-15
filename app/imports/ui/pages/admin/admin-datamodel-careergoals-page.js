import { Template } from 'meteor/templating';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';

Template.Admin_DataModel_CareerGoals_Page.helpers({
  // add you helpers here
});

Template.Admin_DataModel_CareerGoals_Page.events({
  // add your events here
});

Template.Admin_DataModel_CareerGoals_Page.onCreated(function adminCrudPageOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
});

Template.Admin_DataModel_CareerGoals_Page.onRendered(function adminDataModelPageOnRendered() {
  console.log('onRendered');
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

Template.Admin_DataModel_CareerGoals_Page.onDestroyed(function adminCrudPageOnDestroyed() {
  // add your statement here
});


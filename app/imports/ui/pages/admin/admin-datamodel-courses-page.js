import { Template } from 'meteor/templating';
import { Courses } from '../../../api/career/CareerGoalCollection';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Admin_DataModel_Courses_Page.helpers({
  updateID() {
    return Template.instance().updateID;
  },
  displayUpdateWidget() {
    return Template.instance().updateID.get();
  },
});

Template.Admin_DataModel_Courses_Page.onCreated(function adminCrudPageOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.updateID = new ReactiveVar('');
});

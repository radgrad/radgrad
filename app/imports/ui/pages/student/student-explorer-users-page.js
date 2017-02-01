import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Student_Explorer_Users_Page.helpers({
  userID() {
    return Template.instance().userID;
  },
  displayUser() {
    return Template.instance().userID.get();
  },
});

Template.Student_Explorer_Users_Page.events({
  // add your events here
});

Template.Student_Explorer_Users_Page.onCreated(function studentExplorerUsersPageOnCreated() {
  this.userID = new ReactiveVar('');
});

Template.Student_Explorer_Users_Page.onRendered(function studentExplorerUsersPageOnRendered() {
  // add on rendered.
});

Template.Student_Explorer_Users_Page.onDestroyed(function studentExplorerUsersPageOnDestroyed() {
  // add your statement here
});


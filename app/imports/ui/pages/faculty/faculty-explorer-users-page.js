import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { getExplorerUserID } from '../../utilities/template-helpers';

Template.Faculty_Explorer_Users_Page.onCreated(function facultyExplorerUsersPageOnCreated() {
  this.userID = new ReactiveVar('');
  this.userID.set(getExplorerUserID());
});

Template.Faculty_Explorer_Users_Page.helpers({
  userID() {
    return Template.instance().userID;
  },
  displayUser() {
    return Template.instance().userID.get();
  },
});

Template.Faculty_Explorer_Users_Page.onRendered(function facultyExplorerUsersPageOnRendered() {
  this.userID.set(getExplorerUserID());
});

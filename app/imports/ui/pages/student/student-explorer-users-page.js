import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Users } from '../../../api/user/UserCollection.js';

/** @module ui/pages/student/Student_Explorer_Users_Page */

/**
 * Returns the explorerUserName portion of the route.
 */
export function getExplorerUserID() {
  const username = FlowRouter.getParam('explorerUserName');
  return Users.getID(username);
}

Template.Student_Explorer_Users_Page.onCreated(function studentExplorerUsersPageOnCreated() {
  this.userID = new ReactiveVar('');
  this.userID.set(getExplorerUserID());
});

Template.Student_Explorer_Users_Page.helpers({
  userID() {
    return Template.instance().userID;
  },
  displayUser() {
    return Template.instance().userID.get();
  },
});

Template.Student_Explorer_Users_Page.onRendered(function studentExplorerUsersPageOnRendered() {
  this.userID.set(getExplorerUserID());
});

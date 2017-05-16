import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Users } from '../../../api/user/UserCollection.js';

/** @module ui/pages/facutly/Faculty_Explorer_Users_Page */

/**
 * Returns the explorerUserName portion of the route.
 */
export function getExplorerUserID() {
  const username = FlowRouter.getParam('explorerUserName');
  return Users.findDoc({ username })._id;
}

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

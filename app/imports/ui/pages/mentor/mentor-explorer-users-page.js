import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Users } from '../../../api/user/UserCollection.js';

/**
 * Returns the explorerUserName portion of the route.
 */
export function getExplorerUserID() {
  const username = FlowRouter.getParam('explorerUserName');
  return Users.findDoc({ username })._id;
}

Template.Mentor_Explorer_Users_Page.onCreated(function mentorExplorerUsersPageOnCreated() {
  this.userID = new ReactiveVar('');
  this.userID.set(getExplorerUserID());
});

Template.Mentor_Explorer_Users_Page.helpers({
  userID() {
    return Template.instance().userID;
  },
  displayUser() {
    return Template.instance().userID.get();
  },
});

Template.Mentor_Explorer_Users_Page.onRendered(function mentorExplorerUsersPageOnRendered() {
  this.userID.set(getExplorerUserID());
});

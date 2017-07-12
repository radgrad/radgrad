import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';

/** @module ui/layouts/shared/Logout */

Template.Logout.helpers({
  username() {
    return Meteor.user().username;
  },
});

Template.Logout.events({
  /**
   * Handle the click on the logout link.
   * @param event The click event.
   * @returns {boolean} False.
   */
  'click .logout': function logout(event) {
    event.preventDefault();
    Meteor.logout();
    return false;
  },
});

// Here's how to do the required initialization for Semantic UI dropdown menus.
Template.Logout.onRendered(function enableDropDown() {
  this.$('.dropdown').dropdown({
    action: 'select',
  });
});

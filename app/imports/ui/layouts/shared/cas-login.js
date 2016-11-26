import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ROLE } from '../../../api/role/Role';
import { SessionState, sessionKeys } from '../../../startup/client/session-state';

Template.Cas_Login.events({
  /**
   * Handle the click on the logout link.
   * @param event The click event.
   * @returns {boolean} False.
   */
  'click .cas-logout': function casLogout(event) {
    event.preventDefault();
    Meteor.logout();
    return false;
  },

  /**
   * Handle the click on the login link.
   * @param event The click event.
   * @returns {boolean} False.
   */
  'click .cas-login': function casLogin(event, instance) {
    event.preventDefault();
    const callback = function loginCallback(error) {
      if (error) {
        instance.$('div .ui.error.message.hidden').text('You are not in the allowed list. Go see your Advisor.');
        instance.$('div .ui.error.message.hidden').removeClass('hidden');
      } else {
        const id = Meteor.userId();
        if (Roles.userIsInRole(id, ROLE.ADMIN)) {
          SessionState.set(sessionKeys.CURRENT_ROLE, ROLE.ADMIN);
          SessionState.set(sessionKeys.CURRENT_ADMIN_ID, id);
          FlowRouter.go('/admin');
        } else if (Roles.userIsInRole(id, ROLE.ADVISOR)) {
          SessionState.set(sessionKeys.CURRENT_ROLE, ROLE.ADVISOR);
          SessionState.set(sessionKeys.CURRENT_ADVISOR_ID, id);
          FlowRouter.go('/advisor');
        } else if (Roles.userIsInRole(id, ROLE.FACULTY)) {
          SessionState.set(sessionKeys.CURRENT_ROLE, ROLE.FACULTY);
          SessionState.set(sessionKeys.CURRENT_FACULTY_ID, id);
          FlowRouter.go('/faculty');
        } else if (Roles.userIsInRole(id, ROLE.STUDENT)) {
          SessionState.set(sessionKeys.CURRENT_ROLE, ROLE.STUDENT);
          SessionState.set(sessionKeys.CURRENT_STUDENT_ID, id);
          FlowRouter.go('/student');
        }
      }
    };
    Meteor.loginWithCas(callback);
    return false;
  },
});

// Here's how to do the required initialization for Semantic UI dropdown menus.
Template.Cas_Login.onRendered(function enableDropDown() {
  this.$('.dropdown').dropdown({
    action: 'select',
  });
});

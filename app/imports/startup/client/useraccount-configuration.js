import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ROLE } from '/imports/api/role/Role';
import { SessionState, sessionKeys } from '/imports/startup/client/session-state';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

Accounts.onLogin(function loggedIn() {
  console.log('loggedIn');
  if (Meteor.userId()) {
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
  } else {
    FlowRouter.go('/');
  }
});

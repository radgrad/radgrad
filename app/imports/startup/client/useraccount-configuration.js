import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { SessionState, sessionKeys } from '/imports/startup/client/session-state';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

/**
 * Define a callback to be run when after a user logs in to redirect them to their appropriate home page.
 * This is not straightforward because this callback is invoked even on a page refresh, and we don't want to do
 * anything on a page refresh.
 * To determine if the function is being invoked during a "true" login, we check to see that the userId and
 * roles fields are available. This appears to work, but might fail in subsequent updates to Meteor.
 *
 */
Accounts.onLogin(function onLogin() {
  // here's our big assumption: that Meteor.userId() and the roles field are only defined on initial login.
  const id = Meteor.userId();
  const initialLogin = (id && Roles.getRolesForUser(id).length === 1);

  if (initialLogin) {
    console.log('initial login');
    const username = Meteor.user().username;
    const role = Roles.getRolesForUser(id)[0];
    console.log('onLogin', id, Meteor.user(), username, role);
    SessionState.set(sessionKeys.CURRENT_ROLE, role);
    SessionState.set(sessionKeys[`CURRENT_${role}_ID`], id);
    FlowRouter.go(`/${role.toLowerCase()}/${username}`);
  }
});

Accounts.onLogout(function logout() {
  FlowRouter.go('/');
});

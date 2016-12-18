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
 * This is not straightforward because this callback is invoked even on a page refresh.
 * We rely on a hack: it appears that Meteor.userId is only defined during the initial login and not
 * defined during a page refresh.  We use that assumption to make sure the body of this callback is only
 * executed during a "true" login.
 */
Accounts.onLogin(function onLogin() {
  // here's our big assumption.
  const initialLogin = Meteor.userId();

  if (initialLogin) {
    const id = Meteor.userId();
    const currPath = FlowRouter.current().path;
    const username = Meteor.user().username;
    const role = (Roles.getRolesForUser(id).length === 1) ? Roles.getRolesForUser(id)[0] : undefined;
    // console.log(id, username, Roles.getRolesForUser(id), role);
    SessionState.set(sessionKeys.CURRENT_ROLE, role);
    SessionState.set(sessionKeys[`CURRENT_${role}_ID`], id);
    if (currPath && currPath === '/') {
      FlowRouter.go(`/${role.toLowerCase()}`);
    } else {
      FlowRouter.go('/');
    }
  }
});

Accounts.onLogout(function logout() {
  FlowRouter.go('/');
});

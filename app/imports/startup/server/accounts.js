import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

/* eslint-disable no-console */

/* When running app for first time, pass a settings file to set up a default user account. */
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccount) {
    Accounts.createUser({
      username: Meteor.settings.defaultAccount.username,
      password: Meteor.settings.defaultAccount.password,
    });
  } else {
    console.log('No default user!  Please invoke meteor with a settings file.');
  }
}

Meteor.users.allow({
  insert: function insert(userId, doc) {  // eslint-disable-line no-unused-vars
    // Normally I would check if (this.userId) to see if the method is called by logged in user or guest
    // you can also add some checks here like user role based check etc.,
    return true;
  },
  update: function update(userId, doc, fieldNames, modifier) {  // eslint-disable-line no-unused-vars
  // similar checks like insert
    return true;
  },
  remove: function remove(userId, doc) {  // eslint-disable-line no-unused-vars
    // similar checks like insert
    return true;
  },
});

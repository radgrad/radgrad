import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ValidUserAccounts } from '../../api/user/ValidUserAccountCollection';

/* eslint-disable no-console */

/* Validate username, sending a specific error message on failure. */
Accounts.validateNewUser(function (user) {
  if (user) {
    if (user.services.cas) {
      const username = user.services.cas.id;
      if (username && ValidUserAccounts.find({ username }).count() > 0) {
        return true;
      }
      throw new Meteor.Error(403, 'User not in the allowed list');
    } else if (user.services.password) {
      const username = user.username;
      if (username && ValidUserAccounts.find({ username }).count() > 0) {
        return true;
      }
      throw new Meteor.Error(403, 'User not in the allowed list');
    }
  }
  throw new Meteor.Error(403, 'User not in the allowed list');
});


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

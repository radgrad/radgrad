import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Users } from '/imports/api/user/UserCollection';

/* eslint-disable no-console, no-param-reassign */

const errorMessage = 'User not registered with RadGrad.';

/* Make sure that the person attempting to login has a profile. Otherwise they are not logged in. */
Accounts.validateNewUser(function validate(user) {
  // Don't do this check when running tests.
  if (Meteor.isTest || Meteor.isAppTest || Meteor.settings.public.admin.development) {
    return true;
  }
  // Otherwise ensure that there exists a profile for a user before creating a document for them in Meteor.users.
  if (user) {
    if (user.services.cas) {
      const username = user.services.cas.id;
      if (username && Users.hasProfile(username)) {
        return true;
      }
      throw new Meteor.Error(403, errorMessage);
    } else if (user.services.password) {
      const username = user.username;
      if (username && Users.hasProfile(username)) {
        return true;
      }
      throw new Meteor.Error(403, errorMessage);
    }
  }
  throw new Meteor.Error(403, errorMessage);
});

// // THIS CODE DOES NOT WORK, SO IT IS COMMENTED OUT.
// // IT IS AN ATTEMPT TO ALLOW MIXED CASE LOGINS THROUGH CAS
// /* Make sure that the username is all lower case. */
// Accounts.onCreateUser((options, user) => {
//   if (user) {
//     if (user.services && user.services.cas) {
//       user.services.cas.id = user.services.cas.id.toLowerCase();
//     }
//     if (user.username) {
//       user.username = user.username.toLowerCase();
//     }
//   }
//   if (options.profile) {
//     user.profile = options.profile;
//     if (user.profile.name) {
//       user.profile.name = user.profile.name.toLowerCase();
//     }
//   }
//   return user;
// });


// Meteor.users.allow({
//   insert: function insert(userId, doc) {  // eslint-disable-line no-unused-vars
//     // Normally I would check if (this.userId) to see if the method is called by logged in user or guest
//     // you can also add some checks here like user role based check etc.,
//     return true;
//   },
//   update: function update(userId, doc, fieldNames, modifier) {  // eslint-disable-line no-unused-vars
//   // similar checks like insert
//     return true;
//   },
//   remove: function remove(userId, doc) {  // eslint-disable-line no-unused-vars
//     // similar checks like insert
//     return true;
//   },
// });

// Accounts.onCreateUser((options, user) => {
//   console.log('in on create user', user);
//   return user;
// });

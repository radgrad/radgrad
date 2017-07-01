import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/erasaur:meteor-lodash';

/**
 * Allows students to update their academic plans.
 */
export const dumpDatabaseMethod = new ValidatedMethod({
  name: 'base.dumpDatabase',
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to dump the database..');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin to dump the database.');
      }
    // Don't do the dump except on server side (disable client-side simulation).
    // Return an object with fields timestamp and collections.
    if (Meteor.isServer) {
      const collections = _.sortBy(RadGrad.collectionLoadSequence.map(collection => collection.dumpAll()),
          entry => entry.name);
      const timestamp = new Date();
      return { timestamp, collections };
    }
    return null;
  },
});

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { radgradCollections } from '/imports/api/integritychecker/IntegrityChecker';
import { _ } from 'meteor/erasaur:meteor-lodash';


export const dumpDatabaseMethodName = 'base.dumpDatabase';

export const dumpDatabaseMethod = new ValidatedMethod({
  name: dumpDatabaseMethodName,
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to check integrity.');
    } else
      if (!Roles.userIsInRole(this.userId, ['ADMIN', 'ADVISOR'])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to check integrity.');
      }
    // Don't do the dump except on server side (disable client-side simulation).
    // Return an object with fields timestamp and collections.
    if (Meteor.isServer) {
      const collections = _.sortBy(radgradCollections.map(collection => collection.dumpAll()), entry => entry.name);
      const timestamp = new Date();
      return { timestamp, collections };
    }
    return null;
  },
});

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { radgradCollections } from '/imports/api/integritychecker/IntegrityChecker';

// TODO: should methods.js be Methods.js?  Should the name be exported to avoid a magic string?
// What should the naming convention for methods be to guarantee uniqueness? Use the dir as prefix for namespace?
// Example: base.DumpDatabase?

export const dumpDatabaseMethod = new ValidatedMethod({
  name: 'DumpDatabase',
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to check integrity.');
    } else
      if (!Roles.userIsInRole(this.userId, ['ADMIN', 'ADVISOR'])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to check integrity.');
      }
    // Don't run dumpAll() except on server side (disable client-side simulation).
    return Meteor.isServer && JSON.stringify(radgradCollections.map(collection => collection.dumpAll()), null, 2);
  },
});

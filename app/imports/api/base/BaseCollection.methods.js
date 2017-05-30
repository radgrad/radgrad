import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { RadGrad } from '../radgrad/radgrad';
import { removeAllEntities } from './BaseUtilities';
import { ROLE } from '../role/Role';

/** @module api/base/BaseCollectionMethods */

/**
 * Allows admins to create and return a JSON object to the client representing a snapshot of the RadGrad database.
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

/**
 * Resets all of the RadGrad collections to their empty state. Only available in test mode.
 */
export const resetDatabaseMethod = new ValidatedMethod({
  name: 'base.resetDatabase',
  validate: null,
  run() {
    removeAllEntities();
  },
});

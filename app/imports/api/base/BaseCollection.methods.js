import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { RadGrad } from '../radgrad/RadGrad';
import { AppLogs } from '../log/AppLogCollection';
import { ROLE } from '../role/Role';

/**
 * Allows admins to create and return a JSON object to the client representing a snapshot of the RadGrad database.
 * @memberOf api/base
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
 * Allows admins to create and return a JSON object to the client representing a snapshot of the AppLogCollection.
 * @memberOf api/base
 */
export const dumpAppLogMethod = new ValidatedMethod({
  name: 'base.dumpAppLog',
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
      const applicationLog = [];
      applicationLog.push(AppLogs.dumpAll());
      const timestamp = new Date();
      return { timestamp, applicationLog };
    }
    return null;
  },
});

/**
 * Allows admins to clear the AppLogCollection.
 * @memberOf api/base
 */
export const clearAppLogMethod = new ValidatedMethod({
  name: 'base.clearAppLog',
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
      AppLogs.removeAll();
    }
  },
});

/**
 * Meteor method used to define new instances of the given collection name.
 * @param collectionName the name of the collection.
 * @param definitionDate the object used in the collection.define method.
 * @memberOf api/base
 */
export const defineMethod = new ValidatedMethod({
  name: 'BaseCollection.define',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ collectionName, definitionData }) {
    const collection = RadGrad.getCollection(collectionName);
    collection.assertValidRoleForMethod(this.userId);
    return collection.define(definitionData);
  },
});

export const updateMethod = new ValidatedMethod({
  name: 'BaseCollection.update',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ collectionName, updateData }) {
    const collection = RadGrad.getCollection(collectionName);
    collection.assertValidRoleForMethod(this.userId);
    collection.update(updateData.id, updateData);
    return true;
  },
});

export const removeItMethod = new ValidatedMethod({
  name: 'BaseCollection.removeIt',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ collectionName, instance }) {
    const collection = RadGrad.getCollection(collectionName);
    collection.assertValidRoleForMethod(this.userId);
    collection.removeIt(instance);
    return true;
  },
});

import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { RadGrad } from '../radgrad/RadGrad';
import { ROLE } from '../role/Role';
import { loadCollectionNewDataOnly } from '../utilities/load-fixtures';
import { Feeds } from '../feed/FeedCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';

/**
 * Allows admins to create and return a JSON object to the client representing a snapshot of the RadGrad database.
 * @memberOf api/base
 */
export const dumpDatabaseMethod = new ValidatedMethod({
  name: 'base.dumpDatabase',
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to dump the database..', '', Error().stack);
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin to dump the database.', '', Error().stack);
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

export const loadFixtureMethod = new ValidatedMethod({
  name: 'base.loadFixture',
  validate: null,
  run(fixtureData) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to load a fixture.', '', Error().stack);
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin to load a fixture.', '', Error().stack);
    }
    if (Meteor.isServer) {
      let ret = '';
      _.each(RadGrad.collectionLoadSequence, collection => {
        ret = `${ret} ${loadCollectionNewDataOnly(collection, fixtureData, true)}`;
      });
      // console.log(`loadFixtureMethod ${ret}`);
      const trimmed = ret.trim();
      if (trimmed.length === 0) {
        ret = 'Defined no new instances.';
      }
      return ret;
    }
    return '';
  },
});

export const alumniEmailsMethod = new ValidatedMethod({
  name: 'base.alumniEmails',
  validate: null,
  run(emails) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update alumni.', '', Error().stack);
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin to update alumni.', '', Error().stack);
    }
    if (Meteor.isServer) {
      const alumniEmails = emails.split('\n');
      let count = 0;
      _.forEach(alumniEmails, (e) => {
        // TODO load the names from a config file.
        if (e !== 'samplestudent@hawaii.edu' && e !== 'opq@hawaii.edu' && e !== 'spaek@hawaii.edu' && e !== 'peterleo@hawaii.edu') { // eslint-disable-line max-len
          const profile = StudentProfiles.findDoc({ username: e });
          if (!profile.isAlumni) {
            StudentProfiles.update(profile._id, { isAlumni: true });
            count++;
          }
        }
      });
      return `Changed ${count} students to alumni.`;
    }
    return null;
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
    if (collectionName === Feeds.getCollectionName()) {
      if (Meteor.isServer) {
        const collection = RadGrad.getCollection(collectionName);
        collection.assertValidRoleForMethod(this.userId);
        return collection.define(definitionData);
      }
    } else {
      const collection = RadGrad.getCollection(collectionName);
      collection.assertValidRoleForMethod(this.userId);
      return collection.define(definitionData);
    }
    return '';
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

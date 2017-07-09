import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { RadGrad } from '../radgrad/RadGrad';
import { assertIntegrity } from '../integrity/IntegrityChecker';
import { Users } from '../user/UserCollection';

/** @module api/base/BaseUtilities */

/**
 * Deletes all documents from all RadGrad collections.
 * Checks the integrity of the database before doing the deletion.
 * To be used only in testing mode.
 * @throws { Meteor.Error } If there is an integrity issue with the DB prior to deletion.
 * @returns true
 */
export function removeAllEntities() {
  if (Meteor.isTest || Meteor.isAppTest) {
    assertIntegrity();
    _.forEach(RadGrad.collections, collection => collection._collection.remove({}));
    // Users is not part of RadGrad collections, so must deal with it individually.
    Users.removeAll();
  } else {
    throw new Meteor.Error('removeAllEntities not called in testing mode.');
  }
  return true;
}

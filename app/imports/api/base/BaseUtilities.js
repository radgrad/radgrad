import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { RadGrad } from '../radgrad/RadGrad';
import { assertIntegrity } from '../integrity/IntegrityChecker';

/** @module api/base/BaseUtilities */

/**
 * Deletes all documents from all RadGrad collections.
 * Checks the integrity of the database before doing the deletion.
 * To be used only in testing mode.
 * @throws { Meteor.Error } If there is an integrity issue with the DB prior to deletion.
 */
export function removeAllEntities() {
  if (Meteor.isTest || Meteor.isAppTest) {
    assertIntegrity();
    _.forEach(RadGrad.collections, collection => collection._collection.remove({}));
  } else {
    throw new Meteor.Error('removeAllEntities not called in testing mode.');
  }
}

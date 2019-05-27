import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { RadGrad } from '../radgrad/RadGrad';
// import { assertIntegrity } from '../integrity/IntegrityChecker';
import { Users } from '../user/UserCollection';

/**
 * Deletes all documents from all RadGrad collections.
 * Checks the integrity of the database before doing the deletion.
 * To be used only in testing mode.
 * @memberOf api/base
 * @throws { Meteor.Error } If there is an integrity issue with the DB prior to deletion.
 * @returns true
 */
export function removeAllEntities() {
  if (Meteor.isTest || Meteor.isAppTest) {
    // assertIntegrity();  // this started failing after update to Meteor 1.6.1!
    _.forEach(RadGrad.collections, collection => collection._collection.remove({}));
    // Users is not part of RadGrad collections, so must deal with it individually.
    Users.removeAll();
  } else {
    throw new Meteor.Error('removeAllEntities not called in testing mode.', '', Error().stack);
  }
  return true;
}

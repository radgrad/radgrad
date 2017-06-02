import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import { RadGrad } from '../radgrad/radgrad';
import { ROLE } from '../role/Role';

/** @module api/base/BaseUtilities */

/**
 * Deletes all documents from all RadGrad collections.
 * To be used only in testing mode.
 */
export function removeAllEntities() {
  if (Meteor.isTest || Meteor.isAppTest) {
    _.forEach(RadGrad.collections, collection => collection._collection.remove({}));
  } else {
    throw new Meteor.Error('removeAllEntities not called in testing mode.');
  }
}

/**
 * Helper function to assert that the user is in the appropriate role.
 * @param userId The userID.
 * @param roles An arry of roles.
 */
function assertRole(userId, roles) {
  if (!userId) {
    throw new Meteor.Error('unauthorized', 'You must be logged in.');
  } else
    if (!Roles.userIsInRole(userId, roles)) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor..');
    }
}

export function assertAdminOrAdvisor(userId) {
  assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR]);
}

export function assertAdmin(userId) {
  assertRole(userId, [ROLE.ADMIN]);
}

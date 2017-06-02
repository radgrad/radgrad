import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { RadGrad } from '../radgrad/RadGrad';

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

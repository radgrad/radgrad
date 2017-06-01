import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import {
  VerificationRequests,
} from './VerificationRequestCollection';

/** @module api/verification/VerificationRequestCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const verificationRequestsDefineMethod = new ValidatedMethod({
  name: 'VerificationRequests.define',
  validate: null,
  run(definition) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define VerificationRequests.');
    }
    return VerificationRequests.define(definition);
  },
});

/**
 * The ValidatedMethod for updating VerificationRequests.
 */
export const verificationRequestsUpdateMethod = new ValidatedMethod({
  name: 'VerificationRequests.update',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update VerificationRequests.');
    }
    return VerificationRequests.update(update.id, { $set: update });
  },
});

/**
 * The ValidatedMethod for updating VerificationRequests.
 */
export const verificationRequestsUpdateStatusMethod = new ValidatedMethod({
  name: 'VerificationRequests.updateStatus',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update VerificationRequests.');
    }
    return VerificationRequests.updateStatus(update.id, update.status, update.processed);
  },
});


/**
 * The ValidatedMethod for removing VerificationRequests.
 */
export const verificationRequestsRemoveItMethod = new ValidatedMethod({
  name: 'VerificationRequests.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete VerificationRequests.');
    }
    return VerificationRequests.removeIt(removeArgs.id);
  },
});

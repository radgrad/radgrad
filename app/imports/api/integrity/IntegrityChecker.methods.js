import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { checkIntegrity } from './IntegrityChecker.js';

/** @module api/integrity/IntegrityCheckerMethods */

/**
 * The check integrity ValidatedMethod.
 */
export const checkIntegrityMethod = new ValidatedMethod({
  name: 'IntegrityCheck',
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to check integrity.');
    } else if (!Roles.userIsInRole(this.userId, ['ADMIN', 'ADVISOR'])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to check integrity.');
    }
    return checkIntegrity();
  },
});


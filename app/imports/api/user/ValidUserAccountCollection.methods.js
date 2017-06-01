import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { ValidUserAccounts } from './ValidUserAccountCollection';
import { ROLE } from '../role/Role';

/** @module api/user/ValidUserAccountCollectionMethods */

/**
 * The Validated method for defining ValidUserAccounts.
 */
export const validUserAccountsDefineMethod = new ValidatedMethod({
  name: 'ValidUserAccounts.define',
  validate: null,
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define ValidUserAccounts.');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new ValidUserAccounts.');
    }
    return ValidUserAccounts.define(planDefn);
  },
});

/**
 * The ValidatedMethod for updating PlanChices.
 */
export const validUserAccountsUpdateMethod = new ValidatedMethod({
  name: 'ValidUserAccounts.update',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update ValidUserAccounts.');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to update ValidUserAccounts.');
    }
    return ValidUserAccounts.update(update.id, { $set: update });
  },
});

/**
 * The ValidatedMethod for removing PlanChices.
 */
export const validUserAccountsRemoveItMethod = new ValidatedMethod({
  name: 'ValidUserAccounts.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete ValidUserAccounts.');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to remove new ValidUserAccounts.');
    }
    return ValidUserAccounts.removeIt(removeArgs.id);
  },
});


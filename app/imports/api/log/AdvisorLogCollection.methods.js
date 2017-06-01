import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { AdvisorLogs } from './AdvisorLogCollection';
import { ROLE } from '../role/Role';

/** @module api/log/AdvisorLogCollectionMethods */

/**
 * The validated method for defining AdvisorLogs.
 */
export const advisorLogsDefineMethod = new ValidatedMethod({
  name: 'AdvisorLogs.define',
  validate: null,
  run(helpDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define AdvisorLogs.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new AdvisorLogs.');
      }
    return AdvisorLogs.define(helpDefn);
  },
});

/**
 * The ValidatedMethod for updating AdvisorLogs.
 */
export const advisorLogsUpdateMethod = new ValidatedMethod({
  name: 'AdvisorLogs.update',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update AdvisorLogs.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to update AdvisorLogs.');
      }
    return AdvisorLogs.update(update.id, { $set: update });
  },
});

/**
 * The validated method for removing AdvisorLogs.
 */
export const AdvisorLogsRemoveItMethod = new ValidatedMethod({
  name: 'AdvisorLogs.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to remove AdvisorLogs.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to remove AdvisorLogs.');
      }
    return AdvisorLogs.removeIt(removeArgs.id);
  },
});

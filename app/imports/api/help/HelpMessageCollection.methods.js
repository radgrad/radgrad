import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { HelpMessages } from './HelpMessageCollection';
import { ROLE } from '../role/Role';

/** @module api/help/HelpMessageCollectionMethods */

/**
 * The validated method for defining help messages.
 */
export const helpMessagesDefineMethod = new ValidatedMethod({
  name: 'HelpMessages.define',
  validate: null,
  run(helpDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Help Messages.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Help Messages.');
      }
    return HelpMessages.define(helpDefn);
  },
});

/**
 * The validated method for removing help messages.
 */
export const HelpMessagesRemoveItMethod = new ValidatedMethod({
  name: 'HelpMessages.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to remove Help Messages.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to remove Help Messages.');
      }
    return HelpMessages.removeIt(removeArgs.id);
  },
});

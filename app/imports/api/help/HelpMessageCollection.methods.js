import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { HelpMessages } from './HelpMessageCollection';

/** @module api/help/HelpMessageCollectionMethods */

/**
 * The name of the HelpMessages define method.
 * @type {string}
 */
export const helpMessagesDefineMethodName = 'HelpMessages.define';

/**
 * The Validated method for defining help messages.
 */
export const helpMessagesDefineMethod = new ValidatedMethod({
  name: helpMessagesDefineMethodName,
  validate: new SimpleSchema({
    routeName: { type: String },
    title: { type: String },
    text: { type: String },
  }).validator(),
  run(helpDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Users.');
    } else
      if (!Roles.userIsInRole(this.userId, ['ADMIN', 'ADVISOR'])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new help Goals.');
      }
    return HelpMessages.define(helpDefn);
  },
});

export const helpMessagesRemoveItMethodName = 'HelpMessages.removeIt';

export const HelpMessagesRemoveItMethod = new ValidatedMethod({
  name: helpMessagesRemoveItMethodName,
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Users.');
    } else
      if (!Roles.userIsInRole(this.userId, ['ADMIN', 'ADVISOR'])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Career Goals.');
      }
    return HelpMessages.removeIt(removeArgs.id);
  },
});

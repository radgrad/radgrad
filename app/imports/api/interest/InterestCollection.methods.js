import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Interests } from './InterestCollection';
import { ROLE } from '../role/Role';

/** @module api/interest/InterestCollectionMethods */

/**
 * The validated method for defining Interests.
 */
export const interestsDefineMethod = new ValidatedMethod({
  name: 'Interests.define',
  validate: new SimpleSchema({
    name: { type: String },
    slug: { type: String },
    description: { type: String },
    interestType: { type: String },
  }).validator(),
  run(helpDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Interests.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Interests.');
      }
    return Interests.define(helpDefn);
  },
});

/**
 * The ValidatedMethod for updating Interests.
 */
export const interestsUpdateMethod = new ValidatedMethod({
  name: 'Interests.update',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    name: { type: String },
    slugID: { type: SimpleSchema.RegEx.Id },
    description: { type: String },
    interestTypeID: { type: SimpleSchema.RegEx.Id },
  }).validator(),
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Interests.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to update Interests.');
      }
    return Interests.update(update.id, { $set: update });
  },
});

/**
 * The validated method for removing Interests.
 */
export const interestsRemoveItMethod = new ValidatedMethod({
  name: 'Interests.removeIt',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to remove Interests.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to remove Interests.');
      }
    return Interests.removeIt(removeArgs.id);
  },
});

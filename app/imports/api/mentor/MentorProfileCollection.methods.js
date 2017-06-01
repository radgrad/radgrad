import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { MentorProfiles } from './MentorProfileCollection';
import { ROLE } from '../role/Role';

/** @module api/mentor/MentorProfileCollectionMethods */

/**
 * The validated method for defining MentorProfiles.
 */
export const mentorProfilesDefineMethod = new ValidatedMethod({
  name: 'MentorProfiles.define',
  validate: null,
  run(helpDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define MentorProfiles.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.MENTOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or mentor to define new MentorProfiles.');
      }
    return MentorProfiles.define(helpDefn);
  },
});

/**
 * The ValidatedMethod for updating MentorProfiles.
 */
export const mentorProfilesUpdateMethod = new ValidatedMethod({
  name: 'MentorProfiles.update',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update MentorProfiles.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.MENTOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or mentor to update MentorProfiles.');
      }
    return MentorProfiles.update(update.id, { $set: update });
  },
});

/**
 * The validated method for removing MentorProfiles.
 */
export const MentorProfilesRemoveItMethod = new ValidatedMethod({
  name: 'MentorProfiles.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to remove MentorProfiles.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.MENTOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or mentor to remove MentorProfiles.');
      }
    return MentorProfiles.removeIt(removeArgs.id);
  },
});

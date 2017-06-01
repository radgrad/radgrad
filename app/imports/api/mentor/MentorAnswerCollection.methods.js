import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { MentorAnswers } from './MentorAnswerCollection';
import { ROLE } from '../role/Role';

/** @module api/mentor/MentorAnswerCollectionMethods */

/**
 * The validated method for defining MentorAnswers.
 */
export const mentorAnswersDefineMethod = new ValidatedMethod({
  name: 'MentorAnswers.define',
  validate: null,
  run(helpDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define MentorAnswers.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.MENTOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or mentor to define new MentorAnswers.');
      }
    return MentorAnswers.define(helpDefn);
  },
});

/**
 * The ValidatedMethod for updating MentorAnswers.
 */
export const mentorAnswersUpdateMethod = new ValidatedMethod({
  name: 'MentorAnswers.update',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update MentorAnswers.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.MENTOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or mentor to update MentorAnswers.');
      }
    return MentorAnswers.update(update.id, { $set: update });
  },
});

/**
 * The validated method for removing MentorAnswers.
 */
export const MentorAnswersRemoveItMethod = new ValidatedMethod({
  name: 'MentorAnswers.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to remove MentorAnswers.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.MENTOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or mentor to remove MentorAnswers.');
      }
    return MentorAnswers.removeIt(removeArgs.id);
  },
});

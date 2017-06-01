import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Feedbacks } from './FeedbackCollection';
import { ROLE } from '../role/Role';

/** @module api/feedback/FeedbackCollectionMethods */

// TODO Do we even need these methods. Currently no way to define, update or remove Feedbacks from the client.

/**
 * The Validated method for defining Feedbacks.
 */
export const feedbacksDefineMethod = new ValidatedMethod({
  name: 'Feedbacks.define',
  validate: null,
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Feedbacks.');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Feedbacks.');
    }
    return Feedbacks.define(planDefn);
  },
});

/**
 * The ValidatedMethod for updating Feedbacks.
 */
export const feedbacksUpdateMethod = new ValidatedMethod({
  name: 'Feedbacks.update',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Feedbacks.');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to update new Feedbacks.');
    }
    return Feedbacks.update(update.id, { $set: update });
  },
});

/**
 * The ValidatedMethod for removing Feedbacks.
 */
export const feedbacksRemoveItMethod = new ValidatedMethod({
  name: 'Feedbacks.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete Feedbacks.');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to remove new Feedbacks.');
    }
    return Feedbacks.removeIt(removeArgs.id);
  },
});

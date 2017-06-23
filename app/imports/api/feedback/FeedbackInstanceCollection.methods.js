import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { FeedbackInstances } from './FeedbackInstanceCollection';

/** @module api/feedback/FeedbackInstanceCollectionMethods */

/**
 * Custom method for removing all the instances associated with a student and feedback function.
 */
export const clearFeedbackInstancesMethod = new ValidatedMethod({
  name: 'FeedbackInstances.clear',
  validate: null,
  run({ studentID, functionName }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to clear FeedbackInstances.');
    }
    return FeedbackInstances.clear(studentID, functionName);
  },
});

/**
 * The Validated method for defining FeedbackInstances.
 */
export const feedbackInstancesDefineMethod = new ValidatedMethod({
  name: 'FeedbackInstances.define',
  validate: null,
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define FeedbackInstances.');
    }
    return FeedbackInstances.define(planDefn);
  },
});

/**
 * The ValidatedMethod for updating FeedbackInstances.
 */
export const feedbackInstancesUpdateMethod = new ValidatedMethod({
  name: 'FeedbackInstances.update',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update FeedbackInstances.');
    }
    return FeedbackInstances.update(update.id, { $set: update });
  },
});

/**
 * The ValidatedMethod for removing FeedbackInstances.
 */
export const feedbackInstancesRemoveItMethod = new ValidatedMethod({
  name: 'FeedbackInstances.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete FeedbackInstances.');
    }
    return FeedbackInstances.removeIt(removeArgs.id);
  },
});

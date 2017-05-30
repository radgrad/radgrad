import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { FeedbackInstances } from './FeedbackInstanceCollection';

/** @module api/feedback/FeedbackInstanceCollectionMethods */

/**
 * The Validated method for defining FeedbackInstances.
 */
export const feedbackInstancesDefineMethod = new ValidatedMethod({
  name: 'FeedbackInstances.define',
  validate: new SimpleSchema({
    feedback: { type: String, optional: false },
    user: { type: String, optional: false },
    description: { type: String, optional: false },
    area: { type: String, optional: false },
  }).validator(),
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
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    feedbackID: { type: SimpleSchema.RegEx.Id },
    userID: { type: SimpleSchema.RegEx.Id },
    description: { type: String },
    area: { type: String },
  }).validator(),
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
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete FeedbackInstances.');
    }
    return FeedbackInstances.removeIt(removeArgs.id);
  },
});


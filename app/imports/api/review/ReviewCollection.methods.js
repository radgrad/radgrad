import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Reviews } from './ReviewCollection';


/** @module api/review/ReviewCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const reviewsDefineMethod = new ValidatedMethod({
  name: 'Reviews.define',
  validate: null,
  run(courseDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Reviews.');
    }
    return Reviews.define(courseDefn);
  },
});

/**
 * The ValidatedMethod for updating Reviews.
 */
export const reviewsUpdateMethod = new ValidatedMethod({
  name: 'Reviews.update',
  validate: null,
  run(instanceUpdate) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Reviews.');
    }
    return Reviews.update(instanceUpdate.id, { $set: instanceUpdate });
  },
});

/**
 * The ValidatedMethod for calling Reviews.updateModerated.
 */
export const reviewsUpdateModeratedMethod = new ValidatedMethod({
  name: 'Reviews.updateModerated',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Reviews.');
    }
    return Reviews.updateModerated(update.reviewID, update.moderated, update.visible, update.moderatorComments);
  },
});

/**
 * The ValidatedMethod for removing Reviews.
 */
export const reviewsRemoveItMethod = new ValidatedMethod({
  name: 'Reviews.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete Reviews.');
    }
    return Reviews.removeIt(removeArgs.id);
  },
});

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Feeds } from './FeedCollection';

/** @module api/feed/FeedCollectionMethods */

/**
 * The Validated method for defining NewUser Feeds.
 */
export const feedsDefineNewUserMethod = new ValidatedMethod({
  name: 'Feeds.defineNewUser',
  validate: null,
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Feeds.');
    }
    return Feeds.defineNewUser(planDefn);
  },
});

/**
 * The Validated method for defining NewCourse Feeds.
 */
export const feedsDefineNewCourseMethod = new ValidatedMethod({
  name: 'Feeds.defineNewCourse',
  validate: null,
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Feeds.');
    }
    return Feeds.defineNewCourse(planDefn);
  },
});

/**
 * The Validated method for defining NewOpportunity Feeds.
 */
export const feedsDefineNewOpportunityMethod = new ValidatedMethod({
  name: 'Feeds.defineNewOpportunity',
  validate: null,
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Feeds.');
    }
    return Feeds.defineNewOpportunity(planDefn);
  },
});

/**
 * The Validated method for defining NewVerifiedOpportunity Feeds.
 */
export const feedsDefineNewVerifiedOpportunityMethod = new ValidatedMethod({
  name: 'Feeds.defineNewVerifiedOpportunity',
  validate: null,
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Feeds.');
    }
    return Feeds.defineNewVerifiedOpportunity(planDefn);
  },
});

/**
 * The Validated method for defining NewCourseReview Feeds.
 */
export const feedsDefineNewCourseReviewMethod = new ValidatedMethod({
  name: 'Feeds.defineNewCourseReview',
  validate: null,
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Feeds.');
    }
    return Feeds.defineNewCourseReview(planDefn);
  },
});

/**
 * The Validated method for defining NewOpportunityReview Feeds.
 */
export const feedsDefineNewOpportunityReviewMethod = new ValidatedMethod({
  name: 'Feeds.defineNewOpportunityReview',
  validate: null,
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Feeds.');
    }
    return Feeds.defineNewOpportunityReview(planDefn);
  },
});

/**
 * The ValidatedMethod for updating Feeds.
 */
export const feedsUpdateMethod = new ValidatedMethod({
  name: 'Feeds.update',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Feeds.');
    }
    return Feeds.update(update.id, { $set: update });
  },
});

/**
 * The ValidatedMethod for updating Feed new users.
 */
export const feedsUpdateNewUserMethod = new ValidatedMethod({
  name: 'Feeds.updateNewUser',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Feeds.');
    }
    return Feeds.updateNewUser(update.username, update.existingFeedID);
  },
});

/**
 * The Validated method for updating NewVerifiedOpportunity Feeds.
 */
export const feedsUpdateVerifiedOpportunityMethod = new ValidatedMethod({
  name: 'Feeds.updateVerifiedOpportunity',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Feeds.');
    }
    return Feeds.updateVerifiedOpportunity(update.username, update.existingFeedID);
  },
});

/**
 * The ValidatedMethod for removing Feeds.
 */
export const feedsRemoveItMethod = new ValidatedMethod({
  name: 'Feeds.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete Feeds.');
    }
    return Feeds.removeIt(removeArgs.id);
  },
});

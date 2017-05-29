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
  validate: new SimpleSchema({
    user: { type: [String], optional: false },
    feedType: { type: String, optional: false },
    timestamp: { type: Date, optional: true },
  }).validator(),
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
  validate: new SimpleSchema({
    course: { type: String, optional: false },
    feedType: { type: String, optional: false },
    timestamp: { type: Date, optional: true },
  }).validator(),
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
  validate: new SimpleSchema({
    opportunity: { type: String, optional: false },
    feedType: { type: String, optional: false },
    timestamp: { type: Date, optional: true },
  }).validator(),
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
  validate: new SimpleSchema({
    user: { type: [String], optional: false },
    opportunity: { type: String, optional: false },
    feedType: { type: String, optional: false },
    timestamp: { type: Date, optional: true },
  }).validator(),
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
  validate: new SimpleSchema({
    user: { type: [String], optional: false },
    course: { type: String, optional: false },
    feedType: { type: String, optional: false },
    timestamp: { type: Date, optional: true },
  }).validator(),
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
  validate: new SimpleSchema({
    user: { type: [String], optional: false },
    opportunity: { type: String, optional: false },
    feedType: { type: String, optional: false },
    timestamp: { type: Date, optional: true },
  }).validator(),
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Feeds.');
    }
    return Feeds.defineNewOpportunityReview(planDefn);
  },
});

/**
 * The ValidatedMethod for updating PlanChices.
 */
export const feedsUpdateMethod = new ValidatedMethod({
  name: 'Feeds.update',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    userIDs: { type: [SimpleSchema.RegEx.Id], optional: true },
    opportunityID: { type: SimpleSchema.RegEx.Id, optional: true },
    courseID: { type: SimpleSchema.RegEx.Id, optional: true },
    semesterID: { type: SimpleSchema.RegEx.Id, optional: true },
    description: { type: String },
    timestamp: { type: Date },
    picture: { type: String },
    feedType: { type: String },
  }).validator(),
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Feeds.');
    }
    return Feeds.update(update.id, { $set: update });
  },
});

/**
 * The ValidatedMethod for removing PlanChices.
 */
export const feedsRemoveItMethod = new ValidatedMethod({
  name: 'Feeds.removeIt',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete Feeds.');
    }
    return Feeds.removeIt(removeArgs.id);
  },
});


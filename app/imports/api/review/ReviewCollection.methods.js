import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Reviews } from './ReviewCollection';


/** @module api/review/ReviewCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const reviewsDefineMethod = new ValidatedMethod({
  name: 'Reviews.define',
  validate: new SimpleSchema({
    slug: { type: String },
    student: { type: String },
    reviewType: { type: String },
    reviewee: { type: String },
    semester: { type: String },
    rating: { type: Number },
    comments: { type: String },
    moderated: { type: Boolean },
    visible: { type: Boolean },
    moderatorComments: { type: String, optional: true },
  }).validator(),
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
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    slugID: { type: SimpleSchema.RegEx.Id },
    studentID: { type: SimpleSchema.RegEx.Id },
    reviewType: { type: String },
    revieweeID: { type: SimpleSchema.RegEx.Id },
    semesterID: { type: SimpleSchema.RegEx.Id },
    rating: { type: Number },
    comments: { type: String },
    moderated: { type: Boolean },
    visible: { type: Boolean },
    moderatorComments: { type: String, optional: true },
  }).validator(),
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
  validate: new SimpleSchema({
    reviewID: { type: SimpleSchema.RegEx.Id },
    moderated: { type: Boolean },
    visible: { type: Boolean },
    moderatorComments: { type: String },
  }).validator(),
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
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete Reviews.');
    }
    return Reviews.removeIt(removeArgs.id);
  },
});

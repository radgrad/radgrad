import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Teasers } from './TeaserCollection';

/** @module api/teaser/TeaserCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const teasersDefineMethod = new ValidatedMethod({
  name: 'Teasers.define',
  validate: new SimpleSchema({
    title: { type: String },
    slug: { type: String },
    author: { type: String },
    url: { type: String },
    description: { type: String },
    duration: { type: String },
    interests: { type: [String] },
    opportunity: { type: String, optional: true },
  }).validator(),
  run(definition) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Teasers.');
    }
    return Teasers.define(definition);
  },
});

/**
 * The ValidatedMethod for updating Teasers.
 */
export const teasersUpdateMethod = new ValidatedMethod({
  name: 'Teasers.update',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    title: { type: String },
    slugID: { type: SimpleSchema.RegEx.Id },
    author: { type: String },
    url: { type: String },
    description: { type: String },
    duration: { type: String },
    interestIDs: { type: [SimpleSchema.RegEx.Id] },
    opportunityID: { type: SimpleSchema.RegEx.Id, optional: true },
  }).validator(),
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Teasers.');
    }
    return Teasers.update(update.id, { $set: update });
  },
});

/**
 * The ValidatedMethod for removing Teasers.
 */
export const teasersRemoveItMethod = new ValidatedMethod({
  name: 'Teasers.removeIt',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete Teasers.');
    }
    return Teasers.removeIt(removeArgs.id);
  },
});

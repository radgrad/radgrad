import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Teasers } from './TeaserCollection';

/** @module api/teaser/TeaserCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const teasersDefineMethod = new ValidatedMethod({
  name: 'Teasers.define',
  validate: null,
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
  validate: null,
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
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete Teasers.');
    }
    return Teasers.removeIt(removeArgs.id);
  },
});

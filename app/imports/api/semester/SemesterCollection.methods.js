import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Semesters } from './SemesterCollection';

/** @module api/semester/SemesterCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const semestersDefineMethod = new ValidatedMethod({
  name: 'Semesters.define',
  validate: null,
  run(definition) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Semesters.');
    }
    return Semesters.define(definition);
  },
});

/**
 * The ValidatedMethod for updating Semesters.
 */
export const semestersUpdateMethod = new ValidatedMethod({
  name: 'Semesters.update',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Semesters.');
    }
    return Semesters.update(update.id, { $set: update });
  },
});

/**
 * The ValidatedMethod for removing Semesters.
 */
export const semestersRemoveItMethod = new ValidatedMethod({
  name: 'Semesters.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete Semesters.');
    }
    return Semesters.removeIt(removeArgs.id);
  },
});

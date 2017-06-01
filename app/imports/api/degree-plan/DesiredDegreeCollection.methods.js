import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DesiredDegrees } from './DesiredDegreeCollection';


/** @module api/degree-plan/DesiredDegreeCollectionMethods */

/**
 * The Validated method for defining DesiredDegrees.
 */
export const desiredDegreesDefineMethod = new ValidatedMethod({
  name: 'DesiredDegrees.define',
  validate: null,
  run(definition) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define DesiredDegrees.');
    }
    return DesiredDegrees.define(definition);
  },
});

/**
 * The ValidatedMethod for updating DesiredDegrees.
 */
export const desiredDegreesUpdateMethod = new ValidatedMethod({
  name: 'DesiredDegrees.update',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update DesiredDegrees.');
    }
    return DesiredDegrees.update(update.id, { $set: update });
  },
});

/**
 * The ValidatedMethod for removing DesiredDegrees.
 */
export const desiredDegreesRemoveItMethod = new ValidatedMethod({
  name: 'DesiredDegrees.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete DesiredDegrees.');
    }
    return DesiredDegrees.removeIt(removeArgs.id);
  },
});

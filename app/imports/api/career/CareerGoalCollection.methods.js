import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CareerGoals } from './CareerGoalCollection';

/** @module api/career/CareerGoalCollectionMethods */

/**
 * The name of the CareerGoals define method.
 * @type {string}
 */
export const careerGoalsDefineMethodName = 'CareerGoals.define';

/**
 * The Validated method for defining career goals.
 */
export const careerGoalsDefineMethod = new ValidatedMethod({
  name: careerGoalsDefineMethodName,
  validate: new SimpleSchema({
    name: { type: String, optional: false },
    slug: { type: String, optional: false },
    description: { type: String, optional: false },
    interests: { type: [String], optional: false },
  }).validator(),
  run(goalDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Users.');
    } else
      if (!Roles.userIsInRole(this.userId, ['ADMIN', 'ADVISOR'])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Career Goals.');
      }
    return CareerGoals.define(goalDefn);
  },
});

export const careerGoalsRemoveItMethodName = 'CareerGoals.removeIt';

export const careerGoalsRemoveItMethod = new ValidatedMethod({
  name: careerGoalsRemoveItMethodName,
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(id) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Users.');
    } else
      if (!Roles.userIsInRole(this.userId, ['ADMIN', 'ADVISOR'])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Career Goals.');
      }
    return CareerGoals.removeIt(id);
  },
});

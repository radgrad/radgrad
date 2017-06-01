import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CareerGoals } from './CareerGoalCollection';
import { ROLE } from '../role/Role';

/** @module api/career/CareerGoalCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const careerGoalsDefineMethod = new ValidatedMethod({
  name: 'CareerGoals.define',
  validate: new SimpleSchema({
    name: { type: String, optional: false },
    slug: { type: String, optional: false },
    description: { type: String, optional: false },
    interests: { type: [String], optional: false },
  }).validator(),
  run(goalDefn) {
    if (!Meteor.isTest && !Meteor.isAppTest) {
      if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'You must be logged in to define Career Goals.');
      } else
        if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
          throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Career Goals.');
        }
    }
    const goalID = CareerGoals.define(goalDefn);
    console.log(goalID);
    return goalID;
  },
});

/**
 * The ValidatedMethod for updating CareerGoals.
 */
export const careerGoalsUpdateMethod = new ValidatedMethod({
  name: 'CareerGoals.update',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    name: { type: String },
    description: { type: String },
    interestIDs: { type: [SimpleSchema.RegEx.Id] },
  }).validator(),
  run(goalUpdate) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update Career Goals.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to update Career Goals.');
      }
    return CareerGoals.update(goalUpdate.id, { $set: goalUpdate });
  },
});

/**
 * The ValidatedMethod for removing CareerGoals.
 */
export const careerGoalsRemoveItMethod = new ValidatedMethod({
  name: 'CareerGoals.removeIt',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to remove Career Goals.');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to remove Career Goals.');
      }
    return CareerGoals.removeIt(removeArgs.id);
  },
});

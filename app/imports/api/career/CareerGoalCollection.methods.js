import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CareerGoals } from './CareerGoalCollection';
import { ROLE } from '../role/Role';

/** @module api/career/CareerGoalCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const careerGoalsDefineMethod = new ValidatedMethod({
  name: 'CareerGoals.define',
  validate: null,
  run(goalDefn) {
    if (!Meteor.isTest && !this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Career Goals.');
    } else
      if (!Meteor.isTest && !Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to define new Career Goals.');
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
  validate: null,
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
  validate: null,
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

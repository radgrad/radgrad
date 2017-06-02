import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CareerGoals } from './CareerGoalCollection';
import { assertAdminOrAdvisor } from '../base/BaseUtilities';

/** @module api/career/CareerGoalCollectionMethods */

export const careerGoalsDefineMethod = new ValidatedMethod({
  name: 'CareerGoals.define',
  validate: null,
  run(goalDefn) {
    assertAdminOrAdvisor(this.userId);
    return CareerGoals.define(goalDefn);
  },
});

export const careerGoalsUpdateMethod = new ValidatedMethod({
  name: 'CareerGoals.update',
  validate: null,
  run(goalUpdate) {
    assertAdminOrAdvisor(this.userId);
    return CareerGoals.update(goalUpdate.id, { $set: goalUpdate });
  },
});

export const careerGoalsRemoveItMethod = new ValidatedMethod({
  name: 'CareerGoals.removeIt',
  validate: null,
  run(instance) {
    assertAdminOrAdvisor(this.userId);
    return CareerGoals.removeIt(instance);
  },
});

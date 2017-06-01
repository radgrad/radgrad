import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { AcademicPlans } from './AcademicPlanCollection';


/** @module api/degree-plan/AcademicPlanCollectionMethods */

/**
 * The Validated method for defining AcademicPlans.
 */
export const academicPlansDefineMethod = new ValidatedMethod({
  name: 'AcademicPlans.define',
  validate: null,
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define AcademicPlans.');
    }
    return AcademicPlans.define(planDefn);
  },
});

/**
 * The ValidatedMethod for updating AcademicPlans.
 */
export const academicPlansUpdateMethod = new ValidatedMethod({
  name: 'AcademicPlans.update',
  validate: null,
  run(planUpdate) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update AcademicPlans.');
    }
    return AcademicPlans.update(planUpdate.id, { $set: planUpdate });
  },
});

/**
 * The ValidatedMethod for removing AcademicPlans.
 */
export const academicPlansRemoveItMethod = new ValidatedMethod({
  name: 'AcademicPlans.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete AcademicPlans.');
    }
    return AcademicPlans.removeIt(removeArgs.id);
  },
});


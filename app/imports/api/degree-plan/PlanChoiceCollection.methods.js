import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { PlanChoices } from './PlanChoiceCollection';


/** @module api/degree-plan/PlanChiceCollectionMethods */

/**
 * The Validated method for defining PlanChices.
 */
export const planChoicesDefineMethod = new ValidatedMethod({
  name: 'PlanChoices.define',
  validate: new SimpleSchema({
    degreeSlug: { type: String, optional: false },
    name: { type: String, optional: false },
    semester: { type: String, optional: false },
    coursesPerSemester: { type: [Number], optional: false },
    courseList: { type: [String], optional: true },
  }).validator(),
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define PlanChoices.');
    }
    return PlanChoices.define(planDefn);
  },
});

/**
 * The ValidatedMethod for updating PlanChices.
 */
export const planChoicesUpdateMethod = new ValidatedMethod({
  name: 'PlanChoices.update',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    degreeID: { type: SimpleSchema.RegEx.Id },
    name: { type: String },
    effectiveSemesterID: { type: SimpleSchema.RegEx.Id },
    coursesPerSemester: { type: [Number], minCount: 12, maxCount: 12 },
    courseList: { type: [String] },
  }).validator(),
  run(planUpdate) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update PlanChoices.');
    }
    return PlanChoices.update(planUpdate.id, { $set: planUpdate });
  },
});

/**
 * The ValidatedMethod for removing PlanChices.
 */
export const planChoicesRemoveItMethod = new ValidatedMethod({
  name: 'PlanChoices.removeIt',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete PlanChoices.');
    }
    return PlanChoices.removeIt(removeArgs.id);
  },
});


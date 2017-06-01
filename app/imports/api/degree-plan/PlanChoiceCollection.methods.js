import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { PlanChoices } from './PlanChoiceCollection';


/** @module api/degree-plan/PlanChoiceCollectionMethods */

/**
 * The Validated method for defining PlanChoices.
 */
export const planChoicesDefineMethod = new ValidatedMethod({
  name: 'PlanChoices.define',
  validate: null,
  run(planDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define PlanChoices.');
    }
    return PlanChoices.define(planDefn);
  },
});

/**
 * The ValidatedMethod for updating PlanChoices.
 */
export const planChoicesUpdateMethod = new ValidatedMethod({
  name: 'PlanChoices.update',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update PlanChoices.');
    }
    return PlanChoices.update(update.id, { $set: update });
  },
});

/**
 * The ValidatedMethod for removing PlanChoices.
 */
export const planChoicesRemoveItMethod = new ValidatedMethod({
  name: 'PlanChoices.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete PlanChoices.');
    }
    return PlanChoices.removeIt(removeArgs.id);
  },
});


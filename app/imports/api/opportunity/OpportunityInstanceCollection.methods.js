import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { OpportunityInstances } from './OpportunityInstanceCollection';


/** @module api/opportunity/OpportunityInstanceCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const opportunityInstancesDefineMethod = new ValidatedMethod({
  name: 'OpportunityInstances.define',
  validate: null,
  run(courseDefn) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define OpportunityInstances.');
    }
    return OpportunityInstances.define(courseDefn);
  },
});

/**
 * The ValidatedMethod for updating OpportunityInstances.
 */
export const opportunityInstancesUpdateMethod = new ValidatedMethod({
  name: 'OpportunityInstances.update',
  validate: null,
  run(instanceUpdate) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update OpportunityInstances.');
    }
    return OpportunityInstances.update(instanceUpdate.id, { $set: instanceUpdate });
  },
});

/**
 * The ValidatedMethod for updating OpportunityInstance semesters.
 */
export const opportunityInstancesUpdateSemesterMethod = new ValidatedMethod({
  name: 'OpportunityInstances.updateSemester',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update OpportunityInstances.');
    }
    return OpportunityInstances.updateSemester(update.opportunityInstanceID, update.semesterID);
  },
});

/**
 * The ValidatedMethod for updating OpportunityInstance verified status.
 */
export const opportunityInstancesUpdateVerifiedMethod = new ValidatedMethod({
  name: 'OpportunityInstances.updateVerified',
  validate: null,
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update OpportunityInstances.');
    }
    return OpportunityInstances.updateVerified(update.opportunityInstanceID, update.verified);
  },
});

/**
 * The ValidatedMethod for removing OpportunityInstances.
 */
export const opportunityInstancesRemoveItMethod = new ValidatedMethod({
  name: 'OpportunityInstances.removeIt',
  validate: null,
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete OpportunityInstances.');
    }
    return OpportunityInstances.removeIt(removeArgs.id);
  },
});

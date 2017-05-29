import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { OpportunityInstances } from './OpportunityInstanceCollection';


/** @module api/opportunity/OpportunityInstanceCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const opportunityInstancesDefineMethod = new ValidatedMethod({
  name: 'OpportunityInstances.define',
  validate: new SimpleSchema({
    semester: { type: String },
    opportunity: { type: String },
    verified: { type: Boolean, optional: true },
    student: { type: String },
  }).validator(),
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
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    semesterID: { type: SimpleSchema.RegEx.Id },
    opportunityID: { type: SimpleSchema.RegEx.Id },
    verified: { type: Boolean },
    studentID: { type: SimpleSchema.RegEx.Id },
    ice: { type: Object, optional: true, blackbox: true },
  }).validator(),
  run(instanceUpdate) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update OpportunityInstances.');
    }
    return OpportunityInstances.update(instanceUpdate.id, { $set: instanceUpdate });
  },
});

/**
 * The ValidatedMethod for removing OpportunityInstances.
 */
export const opportunityInstancesRemoveItMethod = new ValidatedMethod({
  name: 'OpportunityInstances.removeIt',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete OpportunityInstances.');
    }
    return OpportunityInstances.removeIt(removeArgs.id);
  },
});

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import {
  VerificationRequests,
  ProcessedSchema,
} from './VerificationRequestCollection';

/** @module api/verification/VerificationRequestCollectionMethods */

/**
 * The Validated method for defining career goals.
 */
export const verificationRequestsDefineMethod = new ValidatedMethod({
  name: 'VerificationRequests.define',
  validate: new SimpleSchema({
    student: { type: String },
    opportunityInstance: { type: SimpleSchema.RegEx.Id, optional: true },
    opportunity: { type: String, optional: true },
    semester: { type: String, optional: true },
  }).validator(),
  run(definition) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define VerificationRequests.');
    }
    return VerificationRequests.define(definition);
  },
});

/**
 * The ValidatedMethod for updating VerificationRequests.
 */
export const verificationRequestsUpdateMethod = new ValidatedMethod({
  name: 'VerificationRequests.update',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    studentID: { type: SimpleSchema.RegEx.Id },
    opportunityInstanceID: { type: SimpleSchema.RegEx.Id },
    submittedOn: { type: Date },
    status: { type: String },
    processed: { type: [ProcessedSchema] },
    ice: { type: Object, optional: true, blackbox: true },
  }).validator(),
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update VerificationRequests.');
    }
    return VerificationRequests.update(update.id, { $set: update });
  },
});

/**
 * The ValidatedMethod for updating VerificationRequests.
 */
export const verificationRequestsUpdateStatusMethod = new ValidatedMethod({
  name: 'VerificationRequests.updateStatus',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
    status: { type: String },
    processed: { type: [ProcessedSchema] },
  }).validator(),
  run(update) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update VerificationRequests.');
    }
    return VerificationRequests.updateStatus(update.id, update.status, update.processed);
  },
});


/**
 * The ValidatedMethod for removing VerificationRequests.
 */
export const verificationRequestsRemoveItMethod = new ValidatedMethod({
  name: 'VerificationRequests.removeIt',
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id, optional: false },
  }).validator(),
  run(removeArgs) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to delete VerificationRequests.');
    }
    return VerificationRequests.removeIt(removeArgs.id);
  },
});

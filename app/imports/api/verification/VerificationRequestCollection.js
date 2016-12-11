import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { moment } from 'meteor/momentjs:moment';

import BaseCollection from '/imports/api/base/BaseCollection';
import { Opportunities } from '../opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection.js';
import { ROLE } from '/imports/api/role/Role';
import { Semesters } from '../semester/SemesterCollection.js';
import { Users } from '/imports/api/user/UserCollection';

/** @module Verification */

const ProcessedSchema = new SimpleSchema({
  date: { type: Date },
  status: { type: String },
  verifier: { type: String },
  feedback: { type: String, optional: true },
});

/**
 * Represents a Verification Request, such as "LiveWire Internship".
 * A student has completed an opportunity (such as an internship or project) and wants to obtain ICE Points by
 * having it verified.
 * @extends module:BaseInstance~BaseCollection
 */
class VerificationRequestCollection extends BaseCollection {

  /**
   * Creates the VerificationRequest collection.
   */
  constructor() {
    super('VerificationRequest', new SimpleSchema({
      studentID: { type: SimpleSchema.RegEx.Id },
      opportunityInstanceID: { type: SimpleSchema.RegEx.Id },
      submittedOn: { type: Date },
      status: { type: String },
      processed: { type: [ProcessedSchema] },
      ice: { type: Object, optional: true, blackbox: true },
    }), new SimpleSchema({
      student: { type: String },
      opportunityInstance: { type: SimpleSchema.RegEx.Id },
      submittedOn: { type: Date, optional: true },
    }));
    this.ACCEPTED = 'Accepted';
    this.REJECTED = 'Rejected';
    this.OPEN = 'Open';
  }

  /**
   * Defines a verification request.
   * @example
   * VerificationRequests.define({ student: 'joesmith', opportunityInstance: 'EiQYeRP4jyyre28Zw' });
   * @param { Object } student and opportunity must be slugs or IDs. SubmittedOn defaults to now.
   * @throws {Meteor.Error} If semester, opportunity, or student cannot be resolved, or if verified is not a boolean.
   * @returns The newly created docID.
   */
  define({ student, opportunityInstance, submittedOn = moment().toDate() }) {
    const studentID = Users.getID(student);
    const oppInstance = OpportunityInstances.findDoc(opportunityInstance);
    const opportunityInstanceID = oppInstance._id;
    const ice = Opportunities.findDoc(oppInstance.opportunityID).ice;
    const status = this.OPEN;
    const processed = [];
    // Define and return the new VerificationRequest
    const requestID = this._collection.insert({ studentID, opportunityInstanceID, submittedOn, status,
      processed, ice });
    return requestID;
  }

  /**
   * Returns the Opportunity associated with the VerificationRequest with the given instanceID.
   * @param instanceID The id of the VerificationRequest.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getOpportunityDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    const opportunity = OpportunityInstances.getOpportunityDoc(instance.opportunityInstanceID);
    return opportunity;
  }

  /**
   * Returns the Opportunity associated with the VerificationRequest with the given instanceID.
   * @param instanceID The id of the VerificationRequest.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getOpportunityInstanceDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return OpportunityInstances.findDoc(instance.opportunityInstanceID);
  }

  /**
   * Returns the Semester associated with the VerificationRequest with the given instanceID.
   * @param instanceID The id of the VerificationRequest.
   * @returns {Object} The associated Semester.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getSemesterDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    const oppInstance = OpportunityInstances.findDoc(instance.opportunityInstanceID);
    return Semesters.findDoc(oppInstance.semesterID);
  }

  /**
   * Returns the Sponsor associated with the VerificationRequest with the given instanceID.
   * @param instanceID The id of the VerificationRequest.
   * @returns {Object} The associated Sponsor.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getSponsorDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    const opportunity = OpportunityInstances.getOpportunityDoc(instance.opportunityInstanceID);
    return Users.findDoc(opportunity.sponsorID);
  }

  /**
   * Returns the Student associated with the VerificationRequest with the given instanceID.
   * @param instanceID The id of the VerificationRequest.
   * @returns {Object} The associated Student.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getStudentDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return Users.findDoc(instance.studentID);
  }

  /**
   * Depending on the logged in user publish only their VerificationRequests. If
   * the user is in the Role.ADMIN, ADVISOR or FACULTY then publish all OpportunityInstances. If the
   * system is in mockup mode publish all OpportunityInstances.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this._collectionName, function publish() {
        if (!!Meteor.settings.mockup || Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR, 'FACULTY'])) {
          return instance._collection.find();
        }
        return instance._collection.find({ studentID: this.userId });
      });
    }
  }

  /**
   * Updates the VerificationRequest's status and processed array.
   * @param requestID The VerificationRequest ID.
   * @param status The new Status.
   * @param processed The new array of process records.
   */
  updateStatus(requestID, status, processed) {
    this.assertDefined(requestID);
    this._collection.update({ _id: requestID }, { $set: { status, processed } });
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const VerificationRequests = new VerificationRequestCollection();


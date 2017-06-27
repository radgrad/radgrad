import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { moment } from 'meteor/momentjs:moment';
import BaseCollection from '../base/BaseCollection';
import { Opportunities } from '../opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection.js';
import { ROLE } from '../role/Role';
import { Semesters } from '../semester/SemesterCollection.js';
import { Users } from '../user/UserCollection';


/** @module api/verification/VerificationRequestCollection */

/**
 * Schema for the processed information of VerificationRequests.
 */
export const ProcessedSchema = new SimpleSchema({
  date: Date,
  status: String,
  verifier: String,
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
      studentID: SimpleSchema.RegEx.Id,
      opportunityInstanceID: SimpleSchema.RegEx.Id,
      submittedOn: Date,
      status: String,
      processed: [ProcessedSchema],
      ice: { type: Object, optional: true, blackbox: true },
    }));
    this.ACCEPTED = 'Accepted';
    this.REJECTED = 'Rejected';
    this.OPEN = 'Open';
  }

  /**
   * Defines a verification request.
   * @example
   * VerificationRequests.define({ student: 'joesmith',
   *                               opportunityInstance: 'EiQYeRP4jyyre28Zw' });
   * or
   * VerificationRequests.define({ student: 'joesmith',
   *                               opportunity: 'TechHui',
    *                              semester: 'Fall-2015'});
   * @param { Object } student and opportunity must be slugs or IDs. SubmittedOn defaults to now.
   * status defaults to OPEN, and processed defaults to an empty array.
   * You can either pass the opportunityInstanceID or pass the opportunity and semester slugs. If opportunityInstance
   * is not defined, then the student, opportunity, and semester arguments are used to look it up.
   * @throws {Meteor.Error} If semester, opportunity, opportunityInstance or student cannot be resolved,
   * or if verified is not a boolean.
   * @returns The newly created docID.
   */
  define({ student, opportunityInstance, submittedOn = moment().toDate(), status = this.OPEN, processed = [],
           semester, opportunity }) {
    const studentID = Users.getID(student);
    const oppInstance = opportunityInstance ? OpportunityInstances.findDoc(opportunityInstance) :
        OpportunityInstances.findOpportunityInstanceDoc(semester, opportunity, student);
    if (!oppInstance) {
      throw new Meteor.Error('Could not find the opportunity instance to associate with this verification request');
    }
    const opportunityInstanceID = oppInstance._id;
    const ice = Opportunities.findDoc(oppInstance.opportunityID).ice;
    // Define and return the new VerificationRequest
    const requestID = this._collection.insert({
      studentID, opportunityInstanceID, submittedOn, status, processed, ice,
    });
    return requestID;
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or
   * Student.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  assertValidRoleForMethod(userId) {
    this._assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
  }

  /**
   * Returns the VerificationRequestID associated with opportunityInstanceID, or null if not found.
   * @param opportunityInstanceID The opportunityInstanceID
   * @returns The VerificationRequestID, or null if not found.
   */
  findVerificationRequest(opportunityInstanceID) {
    const result = this._collection.find({ opportunityInstanceID });
    if (result) {
      return result.fetch()[0]._id;
    }
    return result;
  }

  /**
   * Removes all VerificationRequest documents referring to user.
   * @param user The user, either the ID or the username.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  removeUser(user) {
    const studentID = Users.getID(user);
    this._collection.remove({ studentID });
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
   * the user is in the Role.ADMIN, ADVISOR or FACULTY then publish all Verification Requests.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this._collectionName, function publish() {
        if (Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY])) {
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

  /**
   * Sets the passed VerificationRequest to be verified.
   * @param verificationRequestID The VerificationRequest
   * @param verifier The user who did the verification.
   * @throws { Meteor.Error } If verificationRequestID or verifyingUser are not defined.
   */
  setVerified(verificationRequestID, verifyingUser) {
    this.assertDefined(verificationRequestID);
    const verifierID = Users.getID(verifyingUser);
    const verifier = Users.findDoc(verifierID).username;
    const date = new Date();
    const status = this.ACCEPTED;
    const processed = [{ date, status, verifier }];
    this._collection.update(verificationRequestID, { $set: { status, processed } });
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks studentID, advisorID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Users.isDefined(doc.studentID)) {
        problems.push(`Bad studentID: ${doc.studentID}`);
      }
      if (!Users.isDefined(doc.advisorID)) {
        problems.push(`Bad advisorID: ${doc.advisorID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the VerificationRequest docID in a format acceptable to define().
   * @param docID The docID of an VerificationRequest.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const student = Users.findSlugByID(doc.studentID);
    const opportunityInstance = OpportunityInstances.findDoc(doc.opportunityInstanceID);
    const semester = Semesters.findSlugByID(opportunityInstance.semesterID);
    const opportunity = Opportunities.findSlugByID(opportunityInstance.opportunityID);
    const submittedOn = doc.submittedOn;
    const status = doc.status;
    const processed = doc.processed;
    return { student, semester, opportunity, submittedOn, status, processed };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const VerificationRequests = new VerificationRequestCollection();

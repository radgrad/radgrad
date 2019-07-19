import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { moment } from 'meteor/momentjs:moment';
import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseCollection from '../base/BaseCollection';
import { Opportunities } from '../opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection.js';
import { ROLE } from '../role/Role';
import { Semesters } from '../semester/SemesterCollection.js';
import { Users } from '../user/UserCollection';

/**
 * Schema for the processed information of VerificationRequests.
 * @memberOf api/verification
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
 * @extends api/base.BaseCollection
 * @memberOf api/verification
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
      retired: { type: Boolean, optional: true },
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
  define({
           student, opportunityInstance, submittedOn = moment()
      .toDate(), status = this.OPEN, processed = [],
           semester, opportunity, retired,
         }) {
    const studentID = Users.getID(student);
    const oppInstance = opportunityInstance ? OpportunityInstances.findDoc(opportunityInstance) :
      OpportunityInstances.findOpportunityInstanceDoc(semester, opportunity, student);
    if (!oppInstance) {
      throw new Meteor.Error('Could not find the opportunity instance to associate with this verification request',
        '', Error().stack);
    }
    const opportunityInstanceID = oppInstance._id;
    const ice = Opportunities.findDoc(oppInstance.opportunityID).ice;
    // Define and return the new VerificationRequest
    const requestID = this._collection.insert({
      studentID, opportunityInstanceID, submittedOn, status, processed, ice, retired,
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
    const result = this._collection.findOne({ opportunityInstanceID });
    return result && result._id;
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
   * @param verificationRequestID The id of the VerificationRequest.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getOpportunityDoc(verificationRequestID) {
    this.assertDefined(verificationRequestID);
    const instance = this._collection.findOne({ _id: verificationRequestID });
    const opportunity = OpportunityInstances.getOpportunityDoc(instance.opportunityInstanceID);
    return opportunity;
  }

  /**
   * Returns the Opportunity associated with the VerificationRequest with the given instanceID.
   * @param verificationRequestID The id of the VerificationRequest.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getOpportunityInstanceDoc(verificationRequestID) {
    this.assertDefined(verificationRequestID);
    const instance = this._collection.findOne({ _id: verificationRequestID });
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
   * Returns the Sponsor (faculty) profile associated with the VerificationRequest with the given instanceID.
   * @param instanceID The id of the VerificationRequest.
   * @returns {Object} The associated Faculty profile.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getSponsorDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    const opportunity = OpportunityInstances.findDoc(instance.opportunityInstanceID);
    return Users.getProfile(opportunity.sponsorID);
  }

  /**
   * Returns the Student profile associated with the VerificationRequest with the given instanceID.
   * @param instanceID The id of the VerificationRequest.
   * @returns {Object} The associated Student profile.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getStudentDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return Users.getProfile(instance.studentID);
  }

  /**
   * Depending on the logged in user publish only their VerificationRequests. If
   * the user is in the Role.ADMIN, ADVISOR or FACULTY then publish all Verification Requests.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      // eslint-disable-next-line meteor/audit-argument-checks
      Meteor.publish(this._collectionName, function publish(studentID) {
        if (!this.userId) {  // https://github.com/meteor/meteor/issues/9619
          return this.ready();
        }
        if (Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
          return instance._collection.find();
        }
        if (Roles.userIsInRole(this.userId, [ROLE.ADVISOR])) {
          return instance._collection.find({ retired: { $not: { $eq: true } } });
        }
        if (Roles.userIsInRole(this.userId, [ROLE.FACULTY])) {
          return instance._collection.find({ sponsorID: studentID, retired: { $not: { $eq: true } } });
        }
        return instance._collection.find({ studentID, retired: { $not: { $eq: true } } });
      });
    }
  }

  /**
   * Updates the retired flag for docID.
   * @param docID the ID of the verification request.
   * @param retired the retired status.
   */
  update(docID, { retired }) {
    this.assertDefined(docID);
    const updateData = {};
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this._collection.update(docID, { $set: updateData });
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
    const userID = Users.getID(verifyingUser);
    const verifier = Users.getProfile(userID).username;
    const date = new Date();
    const status = this.ACCEPTED;
    const processed = [{ date, status, verifier }];
    this._collection.update(verificationRequestID, { $set: { status, processed } });
  }

  /**
   * Sets the verification status of the passed VerificationRequest.
   * @param verificationRequestID The ID of the verification request.
   * @param verifyingUser The user who is doing the verification.
   * @param status The status (ACCEPTED, REJECTED, OPEN).
   * @param feedback An optional feedback string.
   * @throws { Meteor.Error } If the verification request or user is not defined.
   */
  setVerificationStatus(verificationRequestID, verifyingUser, status, feedback) {
    this.assertDefined(verificationRequestID);
    const userID = Users.getID(verifyingUser);
    const verifier = Users.getProfile(userID).username;
    const date = new Date();
    const processRecord = { date, status, verifier, feedback };
    this._collection.update(verificationRequestID, { $set: { status }, $push: { processed: processRecord } });
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks studentID, opportunityInstanceID, semesterID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!Users.isDefined(doc.studentID)) {
          problems.push(`Bad studentID: ${doc.studentID}`);
        }
        if (!OpportunityInstances.isDefined(doc.opportunityInstanceID)) {
          problems.push(`Bad opportunityInstanceID: ${doc.opportunityInstanceID}`);
        }
        if (!Semesters.isDefined(doc.semesterID)) {
          problems.push(`Bad semesterID: ${doc.semesterID}`);
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
    const student = Users.getProfile(doc.studentID).username;
    const opportunityInstance = OpportunityInstances.findDoc(doc.opportunityInstanceID);
    const semester = Semesters.findSlugByID(opportunityInstance.semesterID);
    const opportunity = Opportunities.findSlugByID(opportunityInstance.opportunityID);
    const submittedOn = doc.submittedOn;
    const status = doc.status;
    const processed = doc.processed;
    const retired = doc.retired;
    return { student, semester, opportunity, submittedOn, status, processed, retired };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/verification
 * @type {api/verification.VerificationRequestCollection}
 */
export const VerificationRequests = new VerificationRequestCollection();

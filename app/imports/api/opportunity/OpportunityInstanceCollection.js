import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { ROLE } from '/imports/api/role/Role';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Users } from '/imports/api/user/UserCollection';
import BaseCollection from '/imports/api/base/BaseCollection';


/** @module OpportunityInstance */

/**
 * OpportunityInstances indicate that a student wants to take advantage of an Opportunity in a specific semester.
 * @extends module:Base~BaseCollection
 */
class OpportunityInstanceCollection extends BaseCollection {

  /**
   * Creates the OpportunityInstance collection.
   */
  constructor() {
    super('OpportunityInstance', new SimpleSchema({
      semesterID: { type: SimpleSchema.RegEx.Id },
      opportunityID: { type: SimpleSchema.RegEx.Id },
      verified: { type: Boolean },
      studentID: { type: SimpleSchema.RegEx.Id },
      ice: { type: Object, optional: true, blackbox: true },
    }));
  }

  /**
   * Defines a new OpportunityInstance.
   * @example
   * OpportunityInstances.define({ semester: 'Fall-2015',
   *                               opportunity: 'hack2015',
   *                               verified: false,
   *                               student: 'joesmith' });
   * @param { Object } description Semester, opportunity, and student must be slugs or IDs. Verified defaults to false.
   * @throws {Meteor.Error} If semester, opportunity, or student cannot be resolved, or if verified is not a boolean.
   * @returns The newly created docID.
   */

  define({ semester, opportunity, verified = false, student }) {
    // Validate semester, opportunity, verified, and studentID
    const semesterID = Semesters.getID(semester);
    const studentID = Users.getID(student);
    const opportunityID = Opportunities.getID(opportunity);
    if ((typeof verified) !== 'boolean') {
      throw new Meteor.Error(`${verified} is not a boolean.`);
    }
    const ice = Opportunities.findDoc(opportunityID).ice;
    // Define and return the new OpportunityInstance
    const opportunityInstanceID = this._collection.insert({ semesterID, opportunityID, verified, studentID, ice });
    return opportunityInstanceID;
  }

  /**
   * Returns the Opportunity associated with the OpportunityInstance with the given instanceID.
   * @param instanceID The id of the OpportunityInstance.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getOpportunityDoc(instanceID) {
    // this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return Opportunities.findDoc(instance.opportunityID);
  }

  /**
   * Returns the Semester associated with the OpportunityInstance with the given instanceID.
   * @param instanceID The id of the OpportunityInstance.
   * @returns {Object} The associated Semester.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getSemesterDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return Semesters.findDoc(instance.semesterID);
  }

  /**
   * Returns the Student associated with the OpportunityInstance with the given instanceID.
   * @param instanceID The id of the OpportunityInstance.
   * @returns {Object} The associated Student.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getStudentDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return Users.findDoc(instance.studentID);
  }

  /**
   * Depending on the logged in user publish only their OpportunityInstances. If
   * the user is in the Role.ADMIN then publish all OpportunityInstances. If the
   * system is in mockup mode publish all OpportunityInstances.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this._collectionName, function publish() {
        if (!!Meteor.settings.mockup || Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR,
          ROLE.FACULTY, ROLE.STUDENT])) {
          return instance._collection.find();
        }
        return instance._collection.find({ studentID: this.userId });
      });
    }
  }

  /**
   * @returns {String} This opportunity instance, formatted as a string.
   * @param opportunityInstanceID The opportunity instance ID.
   * @throws {Meteor.Error} If not a valid ID.
   */
  toString(opportunityInstanceID) {
    this.assertDefined(opportunityInstanceID);
    const opportunityInstanceDoc = this.findDoc(opportunityInstanceID);
    const semester = Semesters.toString(opportunityInstanceDoc.semesterID);
    const opportunityName = Opportunities.findDoc(opportunityInstanceDoc.opportunityID).name;
    return `[OI ${semester} ${opportunityName}]`;
  }

  /**
   * Updates the OpportunityInstance's Semester.
   * @param opportunityInstanceID The opportunity instance ID.
   * @param semesterID The semester id.
   * @throws {Meteor.Error} If not a valid ID.
   */
  updateSemester(opportunityInstanceID, semesterID) {
    this.assertDefined(opportunityInstanceID);
    Semesters.assertSemester(semesterID);
    this._collection.update({ _id: opportunityInstanceID }, { $set: { semesterID } });
  }

  /**
   * Updates the verified field.
   * @param opportunityInstanceID The opportunity instance ID.
   * @param verified The new value of verified.
   * @throws {Meteor.Error} If not a valid ID.
   */
  updateVerified(opportunityInstanceID, verified) {
    this.assertDefined(opportunityInstanceID);
    this._collection.update({ _id: opportunityInstanceID }, { $set: { verified } });
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const OpportunityInstances = new OpportunityInstanceCollection();

if (Meteor.isServer) {
  const instance = this;
  // eslint-disable-next-line meteor/audit-argument-checks
  Meteor.publish(`${OpportunityInstances._collectionName}.Public`, function publicPublish(opportunityID) {
    // check the opportunityID.
    new SimpleSchema({
      opportunityID: { type: String },
    }).validate({ opportunityID });

    return instance._collection.find({ opportunityID }, { fields: { studentID: 1, semesterID: 1 } });
  });
}

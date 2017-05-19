import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { ROLE } from '/imports/api/role/Role';
import { AcademicYearInstances } from '/imports/api/degree-plan/AcademicYearInstanceCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Users } from '/imports/api/user/UserCollection';
import BaseCollection from '/imports/api/base/BaseCollection';
import { radgradCollections } from '../base/RadGradCollections';

/** @module api/opportunity/OpportunityInstanceCollection */

/**
 * OpportunityInstances indicate that a student wants to take advantage of an Opportunity in a specific semester.
 * @extends module:api/base/BaseCollection~BaseCollection
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
    this.publicationNames = [];
    this.publicationNames.push(this._collectionName);
    this.publicationNames.push(`${this._collectionName}.Public`);
    this.publicationNames.push(`${this._collectionName}.PerStudentAndSemester`);
    this.publicationNames.push(`${this._collectionName}.studentID`);
    if (Meteor.server) {
      this._collection._ensureIndex({ _id: 1, studentID: 1, semesterID: 1 });
    }
  }

  /**
   * Defines a new OpportunityInstance.
   * @example
   * OpportunityInstances.define({ semester: 'Fall-2015',
   *                               opportunity: 'hack2015',
   *                               verified: false,
   *                               student: 'joesmith' });
   * @param { Object } description Semester, opportunity, and student must be slugs or IDs. Verified defaults to false.
   * Note that only one opportunity instance can be defined for a given semester, opportunity, and student.
   * @throws {Meteor.Error} If semester, opportunity, or student cannot be resolved, or if verified is not a boolean.
   * @returns The newly created docID.
   */

  define({ semester, opportunity, verified = false, student }) {
    // Validate semester, opportunity, verified, and studentID
    const semesterID = Semesters.getID(semester);
    const semesterDoc = Semesters.findDoc(semesterID);
    const studentID = Users.getID(student);
    const user = Users.findDoc(studentID);
    const opportunityID = Opportunities.getID(opportunity);
    if (semesterDoc.term === Semesters.SPRING || semesterDoc.term === Semesters.SUMMER) {
      AcademicYearInstances.define({ year: semesterDoc.year - 1, student: user.username });
    } else {
      AcademicYearInstances.define({ year: semesterDoc.year, student: user.username });
    }
    if ((typeof verified) !== 'boolean') {
      throw new Meteor.Error(`${verified} is not a boolean.`);
    }
    if (this.isOpportunityInstance(semester, opportunity, student)) {
      return this.findOpportunityInstanceDoc(semester, opportunity, student)._id;
    }
    const ice = Opportunities.findDoc(opportunityID).ice;
    // Define and return the new OpportunityInstance
    const opportunityInstanceID = this._collection.insert({ semesterID, opportunityID, verified, studentID, ice });
    return opportunityInstanceID;
  }

  /**
   * Returns the opportunityInstance document associated with semester, opportunity, and student.
   * @param semester The semester (slug or ID).
   * @param opportunity The opportunity (slug or ID).
   * @param student The student (slug or ID)
   * @returns { Object } Returns the document or null if not found.
   * @throws { Meteor.Error } If semester, opportunity, or student does not exist.
   */
  findOpportunityInstanceDoc(semester, opportunity, student) {
    const semesterID = Semesters.getID(semester);
    const studentID = Users.getID(student);
    const opportunityID = Opportunities.getID(opportunity);
    return this._collection.findOne({ semesterID, studentID, opportunityID });
  }

  /**
   * Returns true if there exists an OpportunityInstance for the given semester, opportunity, and student.
   * @param semester The semester (slug or ID).
   * @param opportunity The opportunity (slug or ID).
   * @param student The student (slug or ID).
   * @returns True if the opportunity instance exists.
   * @throws { Meteor.Error } If semester, opportunity, or student does not exist.
   */
  isOpportunityInstance(semester, opportunity, student) {
    return !!this.findOpportunityInstanceDoc(semester, opportunity, student);
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
   * Return the publication name.
   * @param index The optional index for the publication name.
   * @returns { String } The publication name, as a string.
   */
  getPublicationName(index) {
    if (index) {
      return this.publicationNames[index];
    }
    return this._collectionName;
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
      Meteor.publish(this.publicationNames[0], function publish() {
        if (!!Meteor.settings.mockup || Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR,
          ROLE.FACULTY, ROLE.STUDENT])) {
          return instance._collection.find();
        }
        return instance._collection.find({ studentID: this.userId });
      });
      Meteor.publish(this.publicationNames[1], function publicPublish(opportunityID) {  // eslint-disable-line
        // check the opportunityID.
        new SimpleSchema({
          opportunityID: { type: String },
        }).validate({ opportunityID });
        return instance._collection.find({ opportunityID }, { fields: { studentID: 1, semesterID: 1 } });
      });
      Meteor.publish(this.publicationNames[2],
          function perStudentAndSemester(studentID, semesterID) {  // eslint-disable-line
            new SimpleSchema({
              studentID: { type: String },
              semesterID: { type: String },
            }).validate({ studentID, semesterID });
            return instance._collection.find({ studentID, semesterID });
          });
      Meteor.publish(this.publicationNames[3], function filterStudentID(studentID) { // eslint-disable-line
        new SimpleSchema({
          studentID: { type: String },
        }).validate({ studentID });
        return instance._collection.find({ studentID });
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

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks semesterID, opportunityID, studentID
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Semesters.isDefined(doc.semesterID)) {
        problems.push(`Bad semesterID: ${doc.semesterID}`);
      }
      if (!Opportunities.isDefined(doc.opportunityID)) {
        problems.push(`Bad opportunityID: ${doc.opportunityID}`);
      }
      if (!Users.isDefined(doc.studentID)) {
        problems.push(`Bad studentID: ${doc.studentID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the OpportunityInstance docID in a format acceptable to define().
   * @param docID The docID of an OpportunityInstance.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const semester = Semesters.findSlugByID(doc.semesterID);
    const opportunity = Opportunities.findSlugByID(doc.opportunityID);
    const verified = doc.verified;
    const student = Users.findSlugByID(doc.studentID);
    return { semester, opportunity, verified, student };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const OpportunityInstances = new OpportunityInstanceCollection();
radgradCollections.push(OpportunityInstances);

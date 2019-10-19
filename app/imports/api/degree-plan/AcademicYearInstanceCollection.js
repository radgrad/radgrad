import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Semesters } from '../semester/SemesterCollection';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';
import BaseCollection from '../base/BaseCollection';

/**
 * Each AcademicYearInstance represents a sequence of three semesters for a given student.
 * It is used to control the display of semesters for a given student in the Degree Planner.
 * @extends api/base.BaseCollection
 * @memberOf api/degree-plan
 */
class AcademicYearInstanceCollection extends BaseCollection {
  /**
   * Creates the AcademicYearInstance collection.
   */
  constructor() {
    super('AcademicYearInstance', new SimpleSchema({
      year: { type: Number },
      springYear: { type: Number },
      studentID: { type: SimpleSchema.RegEx.Id },
      semesterIDs: [SimpleSchema.RegEx.Id],
      retired: { type: Boolean, optional: true },
    }));
    if (Meteor.server) {
      this._collection._ensureIndex({ studentID: 1 });
    }
  }

  /**
   * Defines a new AcademicYearInstance.
   * @example
   * To define the 2016 - 2017 academic year for Joe Smith.
   *     AcademicYearInstances.define({ year: 2016,
   *                                    student: 'joesmith' });
   * @param { Object } Object with keys year and student.
   * @throws {Meteor.Error} If the definition includes an undefined student or a year that is out of bounds.
   * @returns The newly created docID.
   */
  define({ year, student, retired }) {
    const studentID = Users.getID(student);
    // check for gaps
    const prevYears = this._collection.find({ year: { $lt: year }, studentID }, { $sort: { year: 1 } }).fetch();
    if (prevYears.length > 0) {
      const lastYear = prevYears[prevYears.length - 1].year;
      for (let y = lastYear + 1; y < year; y++) {
        if (this._collection.find({ year: y, studentID }).fetch().length === 0) {
          const semesterIDs = [];
          semesterIDs.push(Semesters.getID(`${Semesters.FALL}-${y}`));
          semesterIDs.push(Semesters.getID(`${Semesters.SPRING}-${y + 1}`));
          semesterIDs.push(Semesters.getID(`${Semesters.SUMMER}-${y + 1}`));
          this._collection.insert({
            year: y, springYear: y + 1, studentID, semesterIDs,
          });
        }
      }
    }
    const nextYears = this._collection.find({ year: { $gt: year }, studentID }, { $sort: { year: 1 } }).fetch();
    if (nextYears.length > 0) {
      const nextYear = nextYears[0].year;
      for (let y = year + 1; y < nextYear; y++) {
        if (this._collection.find({ year: y, studentID }).fetch().length === 0) {
          const semesterIDs = [];
          semesterIDs.push(Semesters.getID(`${Semesters.FALL}-${y}`));
          semesterIDs.push(Semesters.getID(`${Semesters.SPRING}-${y + 1}`));
          semesterIDs.push(Semesters.getID(`${Semesters.SUMMER}-${y + 1}`));
          this._collection.insert({
            year: y, springYear: y + 1, studentID, semesterIDs,
          });
        }
      }
    }
    const doc = this._collection.find({ year, studentID }).fetch();
    if (doc.length > 0) {
      return doc[0]._id;
    }
    const semesterIDs = [];
    semesterIDs.push(Semesters.getID(`${Semesters.FALL}-${year}`));
    semesterIDs.push(Semesters.getID(`${Semesters.SPRING}-${year + 1}`));
    semesterIDs.push(Semesters.getID(`${Semesters.SUMMER}-${year + 1}`));

    // Define and return the docID
    return this._collection.insert({
      year, springYear: year + 1, studentID, semesterIDs, retired,
    });
  }

  /**
   * Update an AcademicYear.
   * @param docID The docID associated with this academic year.
   * @param retired if the instance is retired.
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
   * Remove the academic year.
   * @param docID The docID of the academic year.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    // OK, clear to delete.
    super.removeIt(docID);
  }

  /**
   * Removes all AcademicYearInstance documents referring to user.
   * @param user The student, either the ID or the username.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  removeUser(user) {
    const studentID = Users.getID(user);
    this._collection.remove({ studentID });
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
   * Depending on the logged in user publish only their AcademicYears. If
   * the user is an Admin or Advisor then publish all AcademicYears.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this._collectionName, function filterStudentID(studentID) { // eslint-disable-line
        if (!studentID) {
          return this.ready();
        }
        if (Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
          return instance._collection.find();
        }
        return instance._collection.find({ studentID, retired: { $not: { $eq: true } } });
      });
    }
  }

  /**
   * @returns {String} A formatted string representing the academic year instance.
   * @param academicYearInstanceID The academic year instance ID.
   * @throws {Meteor.Error} If not a valid ID.
   */
  toString(academicYearInstanceID) {
    this.assertDefined(academicYearInstanceID);
    const doc = this.findDoc(academicYearInstanceID);
    const { username } = Users.getProfile(doc.studentID);
    return `[AY ${doc.year}-${doc.year + 1} ${username}]`;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks studentID, semesterIDs
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Users.isDefined(doc.studentID)) {
        problems.push(`Bad studentID: ${doc.studentID}`);
      }
      _.forEach(doc.semesterIDs, semesterID => {
        if (!Semesters.isDefined(semesterID)) {
          problems.push(`Bad semesterID: ${semesterID}`);
        }
      });
    });
    return problems;
  }

  /**
   * Returns an object representing the AcademicYearInstance docID in a format acceptable to define().
   * @param docID The docID of an AcademicYearInstance.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const student = Users.getProfile(doc.studentID).username;
    const { year } = doc;
    const { retired } = doc;
    return { student, year, retired };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/degree-plan
 */
export const AcademicYearInstances = new AcademicYearInstanceCollection();
// We are not going to persist AcademicYearInstances

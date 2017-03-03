import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { ROLE } from '/imports/api/role/Role';
import { Users } from '/imports/api/user/UserCollection';
import BaseCollection from '/imports/api/base/BaseCollection';
import { radgradCollections } from '/imports/api/integrity/RadGradCollections';
import { _ } from 'meteor/erasaur:meteor-lodash';

/** @module AcademicYearInstance */

/**
 * Each AcademicYearInstance represents a sequence of three semesters for a given student.
 * It is used to control the display of semesters for a given student in the Degree Planner.
 * @extends module:Base~BaseCollection
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
      semesterIDs: { type: [SimpleSchema.RegEx.Id] },
    }));
    this.publicationNames = [];
    this.publicationNames.push(this._collectionName);
    this.publicationNames.push(`${this._collectionName}.studentID`);
  }

  /**
   * Defines a new AcademicYearInstance.
   * @example
   * To define the 2016 - 2017 academic year for Joe Smith.
   * AcademicYearInstances.define({ year: 2016,
   *                                student: 'joesmith' });
   * @param { Object } Object with keys year and student.
   * @throws {Meteor.Error} If the definition includes an undefined student or a year that is out of bounds.
   * @returns The newly created docID.
   */
  define({ year, student }) {
    const studentID = Users.getID(student);
    const doc = this._collection.find({ year, studentID }).fetch();
    if (doc.length > 0) {
      return doc[0]._id;
    }
    const semesterIDs = [];
    try {
      semesterIDs.push(Semesters.getID(`Fall-${year}`));
    } catch (e) {
      semesterIDs.push(Semesters.define({ term: 'Fall', year }));
    }
    try {
      semesterIDs.push(Semesters.getID(`Spring-${year + 1}`));
    } catch (e) {
      semesterIDs.push(Semesters.define({ term: 'Spring', year: year + 1 }));
    }
    try {
      semesterIDs.push(Semesters.getID(`Summer-${year + 1}`));
    } catch (e) {
      semesterIDs.push(Semesters.define({ term: 'Summer', year: year + 1 }));
    }
    // Define and return the docID
    return this._collection.insert({ year, springYear: year + 1, studentID, semesterIDs });
  }
  /**
   * Depending on the logged in user publish only their AcademicYears. If
   * the user is in the Role.ADMIN then publish all AcademicYears. If the
   * system is in mockup mode publish all AcademicYears.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this.publicationNames[0], function publish() {
        if (!!Meteor.settings.mockup || Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
          return instance._collection.find();
        }
        return instance._collection.find({ studentID: this.userId });
      });
      Meteor.publish(this.publicationNames[1], function filterStudentID(studentID) { // eslint-disable-line
        new SimpleSchema({
          studentID: { type: String },
        }).validate({ studentID });
        return instance._collection.find({ studentID });
      });

    }
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
   * @returns {String} A formatted string representing the academic year instance.
   * @param academicYearInstanceID The academic year instance ID.
   * @throws {Meteor.Error} If not a valid ID.
   */
  toString(academicYearInstanceID) {
    this.assertDefined(academicYearInstanceID);
    const doc = this.findDoc(academicYearInstanceID);
    const student = Users.findDoc(doc.studentID);
    return `[AY ${doc.year}-${doc.year + 1} ${student.username}]`;
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
    const student = Users.findSlugByID(doc.studentID);
    const year = doc.year;
    return { student, year };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const AcademicYearInstances = new AcademicYearInstanceCollection();
radgradCollections.push(AcademicYearInstances);


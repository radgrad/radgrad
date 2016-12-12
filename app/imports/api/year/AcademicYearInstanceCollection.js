import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { ROLE } from '/imports/api/role/Role';
import { Users } from '/imports/api/user/UserCollection';
import BaseCollection from '/imports/api/base/BaseCollection';

/** @module AcademicYearInstance */

/**
 * Each AcademicYearInstance represents one recommendation or warning for a user.
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
  }

  /**
   * Defines a new AcademicYearInstance.
   * @example
   * To define the 2016 - 2017 academic year for Joe Smith.
   * AcademicYearInstances.define({ year: 2016, student: 'joesmith' });
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
   * Depending on the logged in user publish only their CourseInstances. If
   * the user is in the Role.ADMIN then publish all CourseInstances. If the
   * system is in mockup mode publish all CourseInstances.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this._collectionName, function publish() {
        if (!!Meteor.settings.mockup || Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
          return instance._collection.find();
        }
        return instance._collection.find({ studentID: this.userId });
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
    const student = Users.findDoc(doc.studentID);
    return `[AY ${doc.year}-${doc.year + 1} ${student.username}]`;
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const AcademicYearInstances = new AcademicYearInstanceCollection();

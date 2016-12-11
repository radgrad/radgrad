import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ROLE } from '/imports/api/role/Role';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Users } from '/imports/api/user/UserCollection';
import BaseCollection from '/imports/api/base/BaseCollection';


/** @module WorkInstance */

/**
 * WorkInstances indicate the number of hours a week a student worked in a semester at an outside job.
 * @extends module:Base~BaseCollection
 */
class WorkInstanceCollection extends BaseCollection {

  /**
   * Creates the WorkInstance collection.
   */
  constructor() {
    super('WorkInstance', new SimpleSchema({
      semesterID: { type: SimpleSchema.RegEx.Id },
      hrsWk: { type: Number },
      studentID: { type: SimpleSchema.RegEx.Id },
    }), new SimpleSchema({
      semester: { type: String },
      hrsWk: { type: Number },
      student: { type: String },
    }));
  }

  /**
   * Defines a new WorkInstance.
   * @example
   * WorkInstances.define({ semester: `Fall-2015',
   *                        hrsWk: 10,
   *                        student: 'joesmith' });
   * @param { Object } description Requires semester, hrsWk, and student.
   * Semester and student must be a valid slug or an instance ID.
   * @throws {Meteor.Error} If semester, hrsWk, or student are not valid.
   * @returns The newly created docID.
   */
  define({ semester, hrsWk, student }) {
    const semesterID = Semesters.getID(semester);
    const studentID = Users.getID(student);
    if (((typeof hrsWk) !== 'number') || (hrsWk < 0) || (hrsWk > 80)) {
      throw new Meteor.Error(`${hrsWk} is not a number or not between 0 and 80.`);
    }
    // Define and return the new WorkInstance
    const workInstanceID = this._collection.insert({ semesterID, hrsWk, studentID });
    return workInstanceID;
  }

  /**
   * Depending on the logged in user publish only their WorkInstances. If
   * the user is in the Role.ADMIN then publish all WorkInstances. If the
   * system is in mockup mode publish all WorkInstances.
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
   * @returns {String} This work instance, formatted as a string.
   * @param workInstanceID The work instance ID.
   * @throws {Meteor.Error} If not a valid ID.
   */
  toString(workInstanceID) {
    this.assertDefined(workInstanceID);
    const workInstanceDoc = this.findDoc(workInstanceID);
    const semester = Semesters.toString(workInstanceDoc.semesterID);
    const hrsWk = workInstanceDoc.hrsWk;
    return `[WI ${semester} ${hrsWk}]`;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const WorkInstances = new WorkInstanceCollection();

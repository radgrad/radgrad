import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '../base/BaseCollection';
import { Users } from '../user/UserCollection';

/** @module Advisor */

/**
 * Represents the ids that the advisor has selected to view.
 */
class AdvisorChoiceCollection extends BaseCollection {

  /**
   * Creates the Advisor Choice collection.
   */
  constructor() {
    super('AdvisorChoice', new SimpleSchema({
      advisorID: { type: SimpleSchema.RegEx.Id, optional: true },
      studentID: { type: SimpleSchema.RegEx.Id, optional: true },
      username: { type: String, optional: true },
    }));
  }

  /**
   * Defines a new AdvisorChoice.
   * @param advisorID The advisorID.
   * @param studentID The optional studentID.
   * @returns {any}
   */
  define({ advisorID, studentID = null }) {
    Users.assertDefined(advisorID);
    if (studentID) {
      Users.assertDefined(studentID);
    }
    // Define and return the AdminChoice
    return this._collection.insert({ advisorID, studentID });
  }

  /**
   * Returns the Student User Document for the given choice.
   * @param instanceID the choice ID.
   * @returns {*}
   */
  getStudentDoc(instanceID) {
    this.assertDefined(instanceID);
    const choice = this.findDoc(instanceID);
    if (choice.studentID) {
      return Users.findDoc(choice.studentID);
    }
    return null;
  }

  /**
   * Updates the studentID for the given instanceID.
   * @param instanceID the instance ID.
   * @param studentID the student ID.
   */
  updateStudentID(instanceID, studentID) {
    this.assertDefined(instanceID);
    this._collection.update({ _id: instanceID }, { $set: { studentID } });
  }

  /**
   * Updates the students username.
   * @param instanceID the instance ID.
   * @param username the student's username.
   */
  updateUsername(instanceID, username) {
    this.assertDefined(instanceID);
    this._collection.update({ _id: instanceID }, { $set: { username } });
  }

}

export const AdvisorChoices = new AdvisorChoiceCollection();

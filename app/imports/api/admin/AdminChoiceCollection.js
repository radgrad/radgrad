import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '../base/BaseCollection';
import { Users } from '../user/UserCollection';

/** @module Admin */

/**
 * Represents the ids that the admin has selected to view.
 */
class AdminChoiceCollection extends BaseCollection {

  /**
   * Creates the Admin collection.
   */
  constructor() {
    super('Admin', new SimpleSchema({
      adminID: { type: SimpleSchema.RegEx.Id },
      advisorID: { type: SimpleSchema.RegEx.Id, optional: true },
      studentID: { type: SimpleSchema.RegEx.Id, optional: true },
      username: { type: String, optional: true },
      facultyID: { type: SimpleSchema.RegEx.Id, optional: true },
      mentorID: { type: SimpleSchema.RegEx.Id, optional: true },
    }), new SimpleSchema({
      adminID: { type: SimpleSchema.RegEx.Id },
      advisorID: { type: SimpleSchema.RegEx.Id, optional: true },
      studentID: { type: SimpleSchema.RegEx.Id, optional: true },
      facultyID: { type: SimpleSchema.RegEx.Id, optional: true },
      mentorID: { type: SimpleSchema.RegEx.Id, optional: true },
    }));
  }

  /**
   * Defines a new AdminChoice.
   * @param {SimpleSchema.RegEx.Id} adminID the admin ID.
   * @param {SimpleSchema.RegEx.Id} advisorID The optional advisorID.
   * @param {SimpleSchema.RegEx.Id} studentID The optional studentID.
   * @param {SimpleSchema.RegEx.Id} facultyID The optional facultyID.
   * @param {SimpleSchema.RegEx.Id} mentorID The optional mentorID.
   * @returns {any}
   */
  define({ adminID, advisorID = null, studentID = null, facultyID = null, mentorID = null }) {
    Users.assertDefined(adminID);
    if (advisorID) {
      Users.assertDefined(advisorID);
    }
    if (studentID) {
      Users.assertDefined(studentID);
    }
    if (facultyID) {
      Users.assertDefined(facultyID);
    }
    if (mentorID) {
      Users.assertDefined(mentorID);
    }
    // Define and return the AdminChoice
    return this._collection.insert({ adminID, advisorID, studentID, facultyID, mentorID });
  }

  /**
   * Returns the Advisor User Document for the given choice.
   * @param instanceID the choice ID.
   * @returns {*}
   */
  getAdvisorDoc(instanceID) {
    this.assertDefined(instanceID);
    const choice = this.findDoc(instanceID);
    if (choice.advisorID) {
      return Users.findDoc(choice.advisorID);
    }
    return null;
  }

  /**
   * Returns the Faculty User Document for the given choice.
   * @param instanceID the choice ID.
   * @returns {*}
   */
  getFacultyDoc(instanceID) {
    this.assertDefined(instanceID);
    const choice = this.findDoc(instanceID);
    if (choice.facultyID) {
      return Users.findDoc(choice.facultyID);
    }
    return null;
  }

  /**
   * Returns the Mentor User Document for the given choice.
   * @param instanceID the choice ID.
   * @returns {*}
   */
  getMentorDoc(instanceID) {
    this.assertDefined(instanceID);
    const choice = this.findDoc(instanceID);
    if (choice.mentorID) {
      return Users.findDoc(choice.mentorID);
    }
    return null;
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
   * Updates the advisorID for the given instanceID.
   * @param instanceID the instance ID.
   * @param advisorID the student ID.
   */
  updateAdvisorID(instanceID, advisorID) {
    this.assertDefined(instanceID);
    this._collection.update({ _id: instanceID }, { $set: { advisorID } });
  }

  /**
   * Updates the facultyID for the given instanceID.
   * @param instanceID the instance ID.
   * @param facultyID the student ID.
   */
  updateFacultyID(instanceID, facultyID) {
    this.assertDefined(instanceID);
    this._collection.update({ _id: instanceID }, { $set: { facultyID } });
  }

  /**
   * Updates the mentorID for the given instanceID.
   * @param instanceID the instance ID.
   * @param mentorID the student ID.
   */
  updateMentorID(instanceID, mentorID) {
    this.assertDefined(instanceID);
    this._collection.update({ _id: instanceID }, { $set: { mentorID } });
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
   * Updates the students UH ID.
   * @param instanceID the instance ID.
   * @param username the student's username.
   */
  updateUsername(instanceID, username) {
    this.assertDefined(instanceID);
    this._collection.update({ _id: instanceID }, { $set: { username } });
  }
}

export const AdminChoices = new AdminChoiceCollection();

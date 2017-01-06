/**
 * Created by Cam Moore on 12/19/16.
 */

// TODO: Remove this collection, just add an entry to the Advisor Log when Star Data uploaded.

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';

/** @module StarDataLog */

/**
 * Represents STAR data for a particular student.
 * @extends module:Base~BaseCollection
 */
class StarDataLogCollection extends BaseCollection {
  /**
   * Creates the CourseInstance collection.
   */
  constructor() {
    super('StarDataLog', new SimpleSchema({
      studentID: { type: SimpleSchema.RegEx.Id },
      uploadedOn: { type: Date },
      note: { type: String },
    }));
  }

  /**
   * Defines a new StarDataLog instance for the given student and note.
   * @param student The student's username/slug.
   * @param note The result of the upload or similar information.
   */
  define({ student, note }) {
    const studentID = Users.getID(student);
    this._collection.insert({ studentID, note, uploadedOn: new Date() });
  }

  /**
   * Returns the Student associated with the CourseInstance with the given instanceID.
   * @param instanceID The id of the CourseInstance.
   * @returns {Object} The associated Student.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getStudentDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.find({ _id: instanceID });
    return Users.findDoc(instance.studentID);
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
        return null;
      });
    }
  }

}

/**
 * Singleton instance for export.
 * @type {StarDataLogCollection}
 */
export const StarDataLogs = new StarDataLogCollection();

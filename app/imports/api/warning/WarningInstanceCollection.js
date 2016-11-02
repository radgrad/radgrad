import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Users } from '/imports/api/user/UserCollection';
import BaseCollection from '/imports/api/base/BaseCollection';


/** @module WarningInstance */

/**
 * WarningInstances indicate warnings associated with a student.
 * @extends module:Base~BaseCollection
 */
class WarningInstanceCollection extends BaseCollection {

  /**
   * Creates the WorkInstance collection.
   */
  constructor() {
    super('WarningInstance', new SimpleSchema({
      studentID: { type: SimpleSchema.RegEx.Id },
      level: { type: String },
      description: { type: String },
      createdOn: { type: Date },
    }));
    this.OK = 'Ok';
    this.LOW = 'Low';
    this.MEDIUM = 'Medium';
    this.HIGH = 'High';
    this.CRITICAL = 'Critical';
    this.levels = [this.OK, this.LOW, this.MEDIUM, this.HIGH, this.CRITICAL];
  }


  /**
   * Retrieves the docID for the specified Semester, or defines it if not yet present.
   * Implicitly defines the corresponding slug: Spring, 2016 semester is "Spring-2016".
   * @example
   * Semesters.define({ term: Semesters.FALL, year: 2015 });
   * @param { Object } Object with keys term, semester.
   * Term must be one of Semesters.FALL, Semesters.SPRING, or Semesters.SUMMER.
   * Year must be between 1990 and 2050.
   * @throws { Meteor.Error } If the term or year are not correctly specified.
   * @returns The docID for this semester instance.
   */

  /**
   * Retrieves the docID for the specified Warning, or defines it if not yet present.
   * @example
   * WarningInstances.define({ studentID: "ByRyncyiyMq3s8JvD", level: WarningInstances.MEDIUM,
   * description: "Missing prerequisit for ICS 321." })
   * @param { Object } Object with the keys studentID, level, description.
   * @throws { Meteor.Error } If the level is not correctly specified.
   * @return The docID for this WarningInstance instance.
   */
  define({ studentID, level, description }) {
    if (this.levels.indexOf(level) < 0) {
      throw new Meteor.Error('Invalid level: ', level);
    }
    // Return immediately if we can find this semester.
    const doc = this._collection.findOne({ studentID, level, description });
    if (doc) {
      return doc._id;
    }
    return this._collection.insert({ studentID, level, description, createdOn: new Date() });
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
        if (!!Meteor.settings.mockup || Roles.userIsInRole(this.userId, 'ADMIN')) {
          return instance._collection.find();
        }
        return instance._collection.find({ studentID: this.userId });
      });
    }
  }

  /**
   * @returns {String} A formatted string representing the warning instance.
   * @param warningInstanceID The warning instance ID.
   * @throws {Meteor.Error} If not a valid ID.
   */
  toString(warningInstanceID) {
    this.assertDefined(warningInstanceID);
    const warningInstanceDoc = this.findDoc(warningInstanceID);
    const user = Users.findDoc(warningInstanceDoc.studentID);
    return `[WI ${warningInstanceDoc.level}: ${warningInstanceDoc.description} ${user.slug}]`;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const WarningInstances = new WarningInstanceCollection();

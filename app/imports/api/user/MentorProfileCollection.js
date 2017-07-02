import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import { Users } from '../user/UserCollection';
import { ROLE } from '../role/Role';


/** @module api/user/MentorProfileCollection */
/**
 * Represents a Mentor Profile.
 * @extends module:api/base/BaseCollection~BaseCollection
 */
class MentorProfileCollection extends BaseCollection {
  constructor() {
    super('MentorProfile', new SimpleSchema({
      userID: SimpleSchema.RegEx.Id,
      company: String,
      career: String,
      location: String,
      linkedin: { type: String, optional: true },
      motivation: String,
    }));
  }

  /**
   * Defines the profile associated with a Mentor.
   * @param user The user account associated with this Mentor (username or userID).
   * @param company The company the mentor works for.
   * @param career The mentor's career (or title).
   * @param location The mentor's location.
   * @param linkedin The mentor's LinkedIn user ID. (optional)
   * @param motivation The reason why the user mentors.
   * @return { String } The docID of the MentorProfile.
   * @throws { Meteor.Error } If user is not in ROLE.MENTOR.
   */
  define({ user, company, career, location, linkedin, motivation }) {
    const userID = Users.getID(user);
    if (!Roles.userIsInRole(userID, ROLE.MENTOR)) {
      throw new Meteor.Error('Attempt to define a profile for a user who is not a mentor');
    }
    return this._collection.insert({ userID, company, career, location, linkedin, motivation });
  }

  /**
   * Updates the MentorProfile.
   * @param docID the id of the MentorProfile.
   * @param company the company (optional).
   * @param career the career (optional).
   * @param location the location (optional).
   * @param linkedin LinkedIn user ID (optional).
   * @param motivation the motivation (optional).
   */
  update(docID, { company, career, location, linkedin, motivation }) {
    this.assertDefined(docID);
    const updateData = {};
    if (company) {
      updateData.company = company;
    }
    if (career) {
      updateData.career = career;
    }
    if (location) {
      updateData.location = location;
    }
    if (linkedin) {
      updateData.linkedin = linkedin;
    }
    if (motivation) {
      updateData.motivation = motivation;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the mentor profile.
   * @param docID the ID of the profile.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    // OK, clear to delete.
    super.removeIt(docID);
  }

  /**
   * Returns the MentorProfile for the given id.
   * @param userID the id.
   * @return {Cursor}
   */
  getMentorProfile(userID) {
    return this._collection.findOne({ userID });
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or
   * Mentor.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  assertValidRoleForMethod(userId) {
    this._assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.MENTOR]);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks userID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Users.isDefined(doc.userID)) {
        problems.push(`Bad userID: ${doc.userID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the MentorProfile docID in a format acceptable to define().
   * @param docID The docID of a MentorProfile
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const user = Users.findSlugByID(doc.userID);
    const company = doc.company;
    const career = doc.career;
    const location = doc.location;
    const linkedin = doc.linkedin;
    const motivation = doc.motivation;
    return { user, company, career, location, linkedin, motivation };
  }
}

export const MentorProfiles = new MentorProfileCollection();


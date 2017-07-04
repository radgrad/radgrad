import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { Users } from '../user/UserCollection';
import { Interests } from '../interest/InterestCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';
import { profileCommonSchema, updateCommonFields, checkIntegrityCommonFields,
  createMeteorAccount } from './ProfileCommonSchema';

/** @module api/user/MentorProfileCollection */
/**
 * Represents a Mentor Profile.
 * @extends module:api/base/BaseCollection~BaseSlugCollection
 */
class MentorProfileCollection extends BaseSlugCollection {
  constructor() {
    super('MentorProfile', new SimpleSchema({
      company: String,
      career: String,
      location: String,
      linkedin: { type: String, optional: true },
      motivation: String,
    }).extend(profileCommonSchema));
  }

  /**
   * Defines the profile associated with a Mentor.
   * The username does not need to be defined in Meteor Accounts yet, but it must be a unique Slug.
   * @param username The username string associated with this profile, which should be an email.
   * @param firstName The first name.
   * @param lastName The last name.
   * @param picture The URL to their picture. (optional, defaults to a default picture.)
   * @param website The URL to their personal website (optional).
   * @param interests An array of interests. (optional)
   * @param careerGoals An array of career goals. (optional)
   * @param company The company the mentor works for.
   * @param career The mentor's career (or title).
   * @param location The mentor's location.
   * @param linkedin The mentor's LinkedIn user ID. (optional)
   * @param motivation The reason why the user mentors.
   * @throws { Meteor.Error } If username has been previously defined, or if any interests or careerGoals are invalid.
   * @return { String } The docID of the MentorProfile.
   */
  define({ username, firstName, lastName, picture = '/images/default-profile-picture.png', website, interests,
           careerGoals, company, career, location, linkedin, motivation }) {
    const role = ROLE.MENTOR;
    const interestIDs = Interests.getIDs(interests);
    const careerGoalIDs = CareerGoals.getIDs(careerGoals);
    Slugs.define({ name: username, entityName: this.getType() });
    const userID = createMeteorAccount(username);
    Roles.addUsersToRoles(userID, [role]);
    return this._collection.insert({ username, firstName, lastName, role, picture, website, interestIDs, careerGoalIDs,
      company, career, location, linkedin, motivation });
  }

  /**
   * Updates the MentorProfile.
   * You cannot change the username or role once defined.
   * @param docID the id of the MentorProfile.
   * @param company the company (optional).
   * @param career the career (optional).
   * @param location the location (optional).
   * @param linkedin LinkedIn user ID (optional).
   * @param motivation the motivation (optional).
   */
  update(docID, { firstName, lastName, picture, website, interests, careerGoals, company, career, location, linkedin,
    motivation }) {
    this.assertDefined(docID);
    const updateData = {};
    updateCommonFields(updateData, { firstName, lastName, picture, website, interests, careerGoals });
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
   * Returns the profile associated with the specified user.
   * @param user The user (either their username (email) or their userID).
   * @return The MentorProfile document.
   * @throws { Meteor.Error } If user is not a valid user, or profile is not found.
   */
  getProfile(user) {
    const username = Users.getUsername(user);
    const doc = this.findOne({ username });
    if (!doc) {
      throw new Meteor.Error(`No Profile found for user ${username}`);
    }
    return doc;
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
   * Checks the profile common fields and the role..
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    let problems = [];
    this.find().forEach(doc => {
      problems = problems.concat(checkIntegrityCommonFields(doc));
      if (doc.role !== ROLE.MENTOR) {
        problems.push(`MentorProfile instance does not have ROLE.MENTOR: ${doc}`);
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
    const username = doc.username;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const picture = doc.picture;
    const website = doc.website;
    const interests = _.map(doc.interestIDs, interestID => Interests.findSlugByID(interestID));
    const careerGoals = _.map(doc.careerGoalIDs, careerGoalID => CareerGoals.findSlugByID(careerGoalID));
    const company = doc.company;
    const career = doc.career;
    const location = doc.location;
    const linkedin = doc.linkedin;
    const motivation = doc.motivation;
    return { username, firstName, lastName, picture, website, interests, careerGoals, company, career, location,
      linkedin, motivation };
  }
}

export const MentorProfiles = new MentorProfileCollection();

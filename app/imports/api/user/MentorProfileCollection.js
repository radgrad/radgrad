import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseProfileCollection, { defaultProfilePicture } from './BaseProfileCollection';
import { Users } from './UserCollection';
import { Interests } from '../interest/InterestCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';

/**
 * Represents a Mentor Profile.
 * @extends api/user.BaseProfileCollection
 * @memberOf api/user
 */
class MentorProfileCollection extends BaseProfileCollection {
  constructor() {
    super('MentorProfile', new SimpleSchema({
      company: String,
      career: String,
      location: String,
      linkedin: { type: String, optional: true },
      motivation: String,
    }));
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
   * @param retired the retired status (optional).
   * @throws { Meteor.Error } If username has been previously defined, or if any interests or careerGoals are invalid.
   * @return { String } The docID of the MentorProfile.
   */
  define({
    username, firstName, lastName, picture = defaultProfilePicture, website, interests,
    careerGoals, company, career, location, linkedin, motivation, retired,
  }) {
    if (Meteor.isServer) {
      const role = ROLE.MENTOR;
      const interestIDs = Interests.getIDs(interests);
      const careerGoalIDs = CareerGoals.getIDs(careerGoals);
      Slugs.define({ name: username, entityName: this.getType() });
      const profileID = this._collection.insert({
        username, firstName, lastName, role, picture, website, interestIDs, company, career, location, linkedin,
        motivation, careerGoalIDs, userID: this.getFakeUserId(), retired,
      });
      const userID = Users.define({ username, role });
      this._collection.update(profileID, { $set: { userID } });
      return profileID;
    }
    return undefined;
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
  update(docID, {
    firstName, lastName, picture, website, interests, careerGoals, company, career, location, linkedin,
    motivation, retired, courseExplorerFilter, opportunityExplorerSortOrder,
  }) {
    this.assertDefined(docID);
    const updateData = {};
    this._updateCommonFields(updateData, {
      firstName, lastName, picture, website, interests, careerGoals, retired,
    });
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
    if (courseExplorerFilter) {
      updateData.courseExplorerFilter = courseExplorerFilter;
    }
    if (opportunityExplorerSortOrder) {
      updateData.opportunityExplorerSortOrder = opportunityExplorerSortOrder;
    }
    this._collection.update(docID, { $set: updateData });
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
      problems = problems.concat(this._checkIntegrityCommonFields(doc));
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
    const { username } = doc;
    const { firstName } = doc;
    const { lastName } = doc;
    const { picture } = doc;
    const { website } = doc;
    const interests = _.map(doc.interestIDs, interestID => Interests.findSlugByID(interestID));
    const careerGoals = _.map(doc.careerGoalIDs, careerGoalID => CareerGoals.findSlugByID(careerGoalID));
    const { company } = doc;
    const { career } = doc;
    const { location } = doc;
    const { linkedin } = doc;
    const { motivation } = doc;
    const { retired } = doc;
    return {
      username, firstName, lastName, picture, website, interests, careerGoals, company, career, location,
      linkedin, motivation, retired,
    };
  }
}

/**
 * Provides the singleton instance.
 * @type {api/user.MentorProfileCollection}
 * @memberOf api/user
 */
export const MentorProfiles = new MentorProfileCollection();

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

/** @module api/user/AdvisorProfileCollection */
/**
 * Represents a Advisor Profile.
 * @extends module:api/base/BaseCollection~BaseSlugCollection
 */
class AdvisorProfileCollection extends BaseSlugCollection {
  constructor() {
    super('AdvisorProfile', new SimpleSchema({}).extend(profileCommonSchema));
  }

  /**
   * Defines the profile associated with an Advisor and the associated Meteor account.
   * @param username The username string associated with this profile, which should be an email.
   * @param firstName The first name.
   * @param lastName The last name.
   * @param picture The URL to their picture. (optional, defaults to a default picture.)
   * @param website The URL to their personal website (optional).
   * @param interests An array of interests. (optional)
   * @param careerGoals An array of career goals. (optional)
   * @throws { Meteor.Error } If username has been previously defined, or if any interests or careerGoals are invalid.
   * @return { String } The docID of the AdvisorProfile.
   */
  define({ username, firstName, lastName, picture = '/images/default-profile-picture.png', website, interests,
           careerGoals }) {
    const role = ROLE.ADVISOR;
    const interestIDs = Interests.getIDs(interests);
    const careerGoalIDs = CareerGoals.getIDs(careerGoals);
    Slugs.define({ name: username, entityName: this.getType() });
    const userID = createMeteorAccount(username);
    Roles.addUsersToRoles(userID, [role]);
    return this._collection.insert({ username, firstName, lastName, role, picture, website, interestIDs,
      careerGoalIDs });
  }

  /**
   * Updates the AdvisorProfile.
   * You cannot change the username or role once defined.
   * @param docID the id of the AdvisorProfile.
   */
  update(docID, { firstName, lastName, picture, website, interests, careerGoals }) {
    this.assertDefined(docID);
    const updateData = {};
    updateCommonFields(updateData, { firstName, lastName, picture, website, interests, careerGoals });
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Returns the profile associated with the specified user.
   * @param user The user (either their username (email) or their userID).
   * @return The AdvisorProfile document.
   * @throws { Meteor.Error } If user is not a valid Advisor user, or profile is not found.
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
   * Advisor.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  assertValidRoleForMethod(userId) {
    this._assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR]);
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
      if (doc.role !== ROLE.ADVISOR) {
        problems.push(`AdvisorProfile instance does not have ROLE.ADVISOR: ${doc}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the AdvisorProfile docID in a format acceptable to define().
   * @param docID The docID of a AdvisorProfile
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
    return { username, firstName, lastName, picture, website, interests, careerGoals };
  }
}

export const AdvisorProfiles = new AdvisorProfileCollection();

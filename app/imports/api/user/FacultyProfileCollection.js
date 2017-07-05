import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { Users } from '../user/UserCollection';
import { Interests } from '../interest/InterestCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';
import { profileCommonSchema, updateCommonFields, checkIntegrityCommonFields } from './ProfileCommonSchema';

/** @module api/user/FacultyProfileCollection */
/**
 * Represents a Faculty Profile.
 * @extends module:api/base/BaseCollection~BaseSlugCollection
 */
class FacultyProfileCollection extends BaseSlugCollection {
  constructor() {
    super('FacultyProfile', new SimpleSchema({}).extend(profileCommonSchema));
  }

  /**
   * Defines the profile associated with a Faculty.
   * @param username The username string associated with this profile, which should be an email.
   * @param firstName The first name.
   * @param lastName The last name.
   * @param picture The URL to their picture. (optional, defaults to a default picture.)
   * @param website The URL to their personal website (optional).
   * @param interests An array of interests. (optional)
   * @param careerGoals An array of career goals. (optional)
   * @throws { Meteor.Error } If username has been previously defined, or if any interests or careerGoals are invalid.
   * @return { String } The docID of the FacultyProfile.
   */
  define({ username, firstName, lastName, picture = '/images/default-profile-picture.png', website, interests,
           careerGoals }) {
    const role = ROLE.FACULTY;
    const interestIDs = Interests.getIDs(interests);
    const careerGoalIDs = CareerGoals.getIDs(careerGoals);
    Slugs.define({ name: username, entityName: this.getType() });
    const userID = Users.define({ username, role });
    return this._collection.insert({ username, firstName, lastName, role, picture, website, interestIDs,
      careerGoalIDs, userID });
  }

  /**
   * Updates the FacultyProfile.
   * You cannot change the username or role once defined.
   * @param docID the id of the FacultyProfile.
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
   * @return The profile document.
   * @throws { Meteor.Error } If user is not a valid user, or profile is not found.
   */
  getProfile(user) {
    const userID = Users.getID(user);
    const doc = this.findOne({ userID });
    if (!doc) {
      throw new Meteor.Error(`No Faculty profile found for user ${user}`);
    }
    return doc;
  }

  /**
   * Returns non-null if the user has a profile in this collection.
   * @param user The user (either their username (email) or their userID).
   * @return The profile document if the profile exists, or null if not found.
   * @throws { Meteor.Error } If user is not a valid user.
   */
  hasProfile(user) {
    const userID = Users.getID(user);
    return this.findOne({ userID });
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Faculty or
   * Faculty.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Faculty.
   */
  assertValidRoleForMethod(userId) {
    this._assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]);
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
      if (doc.role !== ROLE.FACULTY) {
        problems.push(`FacultyProfile instance does not have ROLE.FACULTY: ${doc}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the FacultyProfile docID in a format acceptable to define().
   * @param docID The docID of a FacultyProfile
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

export const FacultyProfiles = new FacultyProfileCollection();

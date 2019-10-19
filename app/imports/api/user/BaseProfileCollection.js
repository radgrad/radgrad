import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { AdvisorLogs } from '../log/AdvisorLogCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { Feeds } from '../feed/FeedCollection';
import { Interests } from '../interest/InterestCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Slugs } from '../slug/SlugCollection';
import { Users } from './UserCollection';
import { ROLE } from '../role/Role.js';
import { VerificationRequests } from '../verification/VerificationRequestCollection';

/* eslint-disable no-param-reassign, class-methods-use-this */

export const defaultProfilePicture = '/images/default-profile-picture.png';

/** Set up the object to be used to map role names to their corresponding collections.
 * @memberOf api/user */
const rolesToCollectionNames = {};
rolesToCollectionNames[ROLE.ADVISOR] = 'AdvisorProfileCollection';
rolesToCollectionNames[ROLE.FACULTY] = 'FacultyProfileCollection';
rolesToCollectionNames[ROLE.MENTOR] = 'MentorProfileCollection';
rolesToCollectionNames[ROLE.STUDENT] = 'StudentProfileCollection';

/**
 * BaseProfileCollection is an abstract superclass of all profile collections.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/user
 */
class BaseProfileCollection extends BaseSlugCollection {
  constructor(type, schema) {
    super(type, schema.extend(new SimpleSchema({
      username: String,
      firstName: String,
      lastName: String,
      role: String,
      picture: { type: String, optional: true },
      website: { type: String, optional: true },
      interestIDs: [SimpleSchema.RegEx.Id],
      careerGoalIDs: [SimpleSchema.RegEx.Id],
      userID: SimpleSchema.RegEx.Id,
      retired: { type: Boolean, optional: true },
      shareUsername: { type: Boolean, optional: true },
      sharePicture: { type: Boolean, optional: true },
      shareWebsite: { type: Boolean, optional: true },
      shareInterests: { type: Boolean, optional: true },
      shareCareerGoals: { type: Boolean, optional: true },
      courseExplorerFilter: { type: String, optional: true },
      opportunityExplorerSortOrder: { type: String, optional: true },
    })));
  }

  /**
   * The subclass methods need a way to create a profile with a valid, though fake, userId.
   * @returns {string}
   */
  getFakeUserId() {
    return 'ABCDEFGHJKLMNPQRS';
  }

  /**
   * Returns the name of the collection associated with the given profile.
   * @param profile A Profile object.
   * @returns  { String } The name of a profile collection.
   */
  getCollectionNameForProfile(profile) {
    return rolesToCollectionNames[profile.role];
  }

  /**
   * Returns the Profile's docID associated with instance, or throws an error if it cannot be found.
   * If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.
   * If instance is the value for the username field in this collection, then return that document's ID.
   * If instance is the userID for the profile, then return the Profile's ID.
   * If instance is an object with an _id field, then that value is checked to see if it's in the collection.
   * @param { String } instance Either a valid docID, valid userID or a valid slug string.
   * @returns { String } The docID associated with instance.
   * @throws { Meteor.Error } If instance is not a docID or a slug.
   */
  getID(instance) {
    let id;
    // If we've been passed a document, check to see if it has an _id field and use that if available.
    if (_.isObject(instance) && instance._id) {
      instance = instance._id; // eslint-disable-line no-param-reassign
    }
    // If instance is the value of the username field for some document in the collection, then return its ID.
    const usernameBasedDoc = this._collection.findOne({ username: instance });
    if (usernameBasedDoc) {
      return usernameBasedDoc._id;
    }
    // If instance is the value of the userID field for some document in the collection, then return its ID.
    const userIDBasedDoc = this._collection.findOne({ userID: instance });
    if (userIDBasedDoc) {
      return userIDBasedDoc._id;
    }
    // Otherwise see if we can find instance as a docID or as a slug.
    try {
      id = (this._collection.findOne({ _id: instance })) ? instance : this.findIdBySlug(instance);
    } catch (err) {
      throw new Meteor.Error(`Error in ${this._collectionName} getID(): Failed to convert ${instance} to an ID.`,
        '', Error().stack);
    }
    return id;
  }

  /**
   * Returns the profile associated with the specified user.
   * @param user The user (either their username (email) or their userID).
   * @return The profile document.
   * @throws { Meteor.Error } If user is not a valid user, or profile is not found.
   */
  getProfile(user) {
    const userID = Users.getID(user);
    const doc = this._collection.findOne({ userID });
    if (!doc) {
      throw new Meteor.Error(`No profile found for user ${user}`, '', Error().stack);
    }
    return doc;
  }

  /**
   * Returns the profile document associated with username, or null if none was found.
   * @param username A username, such as 'johnson@hawaii.edu'.
   * @returns The profile document, or null.
   */
  findByUsername(username) {
    return this._collection.findOne({ username });
  }

  /**
   * Returns non-null if the user has a profile in this collection.
   * @param user The user (either their username (email) or their userID).
   * @return The profile document if the profile exists, or null if not found.
   * @throws { Meteor.Error } If user is not a valid user.
   */
  hasProfile(user) {
    const userID = Users.getID(user);
    return this._collection.findOne({ userID });
  }

  /**
   * Returns true if the user has set their picture.
   * @param user The user (either their username (email) or their userID).
   * @return {boolean}
   */
  hasSetPicture(user) {
    const userID = Users.getID(user);
    const doc = this._collection.findOne({ userID });
    // console.log(doc);
    if (!doc) {
      return false;
    }
    return !(_.isNil(doc.picture) || doc.picture === defaultProfilePicture);
  }

  /**
   * Returns the userID associated with the given profile.
   * @param profileID The ID of the profile.
   * @returns The associated userID.
   */
  getUserID(profileID) {
    return this._collection.findOne(profileID).userID;
  }

  /**
   * Internal method for use by subclasses.
   * @param doc The profile document.
   * @returns {Array} An array of problems
   */
  _checkIntegrityCommonFields(doc) {
    const problems = [];
    if (!Slugs.isDefined(doc.username)) {
      problems.push(`Bad username: ${doc.username}`);
    }
    _.forEach(doc.careerGoalIDs, careerGoalID => {
      if (!CareerGoals.isDefined(careerGoalID)) {
        problems.push(`Bad careerGoalID: ${careerGoalID}`);
      }
    });
    _.forEach(doc.interestIDs, interestID => {
      if (!Interests.isDefined(interestID)) {
        problems.push(`Bad interestID: ${interestID}`);
      }
    });
    if (!Users.isDefined(doc.userID)) {
      problems.push(`Bad userID: ${doc.userID}`);
    }
    return problems;
  }

  /**
   * Removes this profile, given its profile ID.
   * Also removes this user from Meteor Accounts.
   * @param profileID The ID for this profile object.
   */
  removeIt(profileID) {
    // console.log('BaseProfileCollection.removeIt(%o)', profileID);
    const profile = this._collection.findOne({ _id: profileID });
    const { userID } = profile;
    if (!Users.isReferenced(userID)) {
      // Automatically remove references to user from other collections that are "private" to this user.
      _.forEach([Feeds, CourseInstances, OpportunityInstances, AcademicYearInstances, FeedbackInstances, AdvisorLogs,
        VerificationRequests], collection => collection.removeUser(userID));
      const { username } = profile;
      Meteor.users.remove({ _id: profile.userID });
      Slugs._collection.remove({ name: username });
      super.removeIt(profileID);
    }
  }

  /**
   * Internal method for use by subclasses.
   * Destructively modifies updateData with the values of the passed fields.
   * Call this function for side-effect only.
   */
  _updateCommonFields(updateData, {
    firstName, lastName, picture, website, interests, careerGoals, retired,
  }) {
    if (firstName) {
      updateData.firstName = firstName;
    }
    if (lastName) {
      updateData.lastName = lastName;
    }
    if (picture) {
      updateData.picture = picture;
    }
    if (website) {
      updateData.website = website;
    }
    if (interests) {
      updateData.interestIDs = Interests.getIDs(interests);
    }
    if (careerGoals) {
      updateData.careerGoalIDs = CareerGoals.getIDs(careerGoals);
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    // console.log('_updateCommonFields', updateData);
  }
}

/**
 * The BaseProfileCollection used by all Profile classes.
 * @memberOf api/user
 */
export default BaseProfileCollection;

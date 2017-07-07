import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { Users } from './UserCollection';
import { Slugs } from '../slug/SlugCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Interests } from '../interest/InterestCollection';

/** @module api/user/BaseProfileCollection */

/* eslint-disable no-param-reassign, class-methods-use-this */

/**
 * BaseProfileCollection is an abstract superclass of all profile collections.
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
    })));
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
      throw new Meteor.Error(`No profile found for user ${user}`);
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
   * Returns the userID associated with the given profile.
   * @param profileID The ID of the profile.
   * @returns The associated userID.
   */
  getUserID(profileID) {
    return this.findOne(profileID).userID;
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
   * Internal method for use by subclasses.
   */
  _updateCommonFields(updateData, { firstName, lastName, picture, website, interests, careerGoals }) {
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
  }
}

/**
 * The BaseProfileCollection used by all Profile classes.
 */
export default BaseProfileCollection;

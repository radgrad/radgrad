import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { Interests } from '../interest/InterestCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';

/**
 * Provides the schema specification for the fields common to all profiles.
 */
export const profileCommonSchema = new SimpleSchema({
  username: String,
  firstName: String,
  lastName: String,
  role: String,
  picture: { type: String, optional: true },
  website: { type: String, optional: true },
  interestIDs: [SimpleSchema.RegEx.Id],
  careerGoalIDs: [SimpleSchema.RegEx.Id],
  userID: SimpleSchema.RegEx.Id,
});

/* eslint-disable no-param-reassign */
/**
 * Updates the passed updateData object for the fields in the common schema.
 * @param updateData An object whose fields will be updated by the remaining parameters.
 * @param firstName The first name.
 * @param lastName The last name.
 * @param picture The picture.
 * @param website The website.
 * @param interests An array of interests.
 * @param careerGoals An array of careerGoals.
 * @throws { Meteor.Error } If any of the interests or careerGoals are not valid.
 */
export function updateCommonFields(updateData, { firstName, lastName, picture, website, interests, careerGoals }) {
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

/**
 * Returns an array of strings, each one representing an integrity problem with this document by review
 * of the common profile fields.
 * Returns an empty array if no problems were found.
 * Checks username, interestIDs, and careerGoalIDs
 * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
 */
export function checkIntegrityCommonFields(doc) {
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

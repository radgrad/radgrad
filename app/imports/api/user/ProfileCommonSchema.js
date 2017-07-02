import SimpleSchema from 'simpl-schema';
import { Interests } from '../interest/InterestCollection';
import { CareerGoals } from '../career/CareerGoalCollection';

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

import { moment } from 'meteor/momentjs:moment';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Users } from '../user/UserCollection';
import { ROLE } from '../role/Role';

/**
 * Represents a log of user interactions with RadGrad.
 * An interaction may be a profile update or a page visit, such as a student updating their
 * career goals, or visiting the degree planner.
 *
 * username is the username of the user that performed the interaction.
 * type is one of the following:
 *   pageView: the user is now visiting a page.  (typeData: path to page)
 *   login: the user has just logged in. (typeData: "N/A").
 *   interestIDs, careerGoalIDs, academicPlanIDs, declaredSemesterID, picture, website: user modifies fields.
 *   (typeData: shows the new set of IDs after the modification).
 *   addCourse, addOpportunity, removeCourse, removeOpportunity: user added/removed an instance
 * @extends api/base.BaseCollection
 * @memberOf api/analytic
 */
class UserInteractionCollection extends BaseCollection {

  /**
   * Creates the UserInteraction collection
   */
  constructor() {
    super('UserInteraction', new SimpleSchema({
      username: { type: String },
      type: { type: String },
      typeData: [String],
      timestamp: { type: Date },
    }));
  }

  /**
   * Defines a user interaction record. An interaction object consists of a key-value pair: the key
   * representing the interaction type and the value representing any data associated with the interaction,
   * such as the ID for a newly added interest, or the name of a page that was visited.
   * @param username The username.
   * @param interaction The interaction type and any data associated with the interaction.
   * @param timestamp The time of interaction.
   */
  define({ username, type, typeData, timestamp = moment().toDate() }) {
    this._collection.insert({ username, type, typeData, timestamp });
  }

  /**
   * Removes all interaction documents from referenced user.
   * @param username The username of user to be removed.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  removeUser(username) {
    this._collection.remove({ username });
  }

  /**
   * Asserts that the userID belongs to a valid role when running the define and removeUser method
   * within this class.
   * @param username The username of the logged in user.
   */
  assertValidRoleForMethod(userId) {
    this._assertRole(userId, [ROLE.ADMIN, ROLE.STUDENT, ROLE.MENTOR, ROLE.FACULTY]);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    const problems = [];
    this.find().forEach(doc => {
      if (!Users.isDefined(doc.username)) {
        problems.push(`Bad user: ${doc.username}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the UserInteraction docID in a format acceptable to define().
   * @param docID The docID of a UserInteraction.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const username = doc.username;
    const timestamp = doc.timestamp;
    const type = doc.type;
    const typeData = doc.typeData;
    return { username, type, typeData, timestamp };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/log.UserInteractionCollection}
 * @memberOf api/analytic
 */
export const UserInteractions = new UserInteractionCollection();

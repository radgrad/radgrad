import { moment } from 'meteor/momentjs:moment';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Users } from '../user/UserCollection';
import { ROLE } from '../role/Role';

/**
 * Represents a log of user interactions with RadGrad.
 * An interaction may be a profile update or a page visit, such as a student updating their
 * career goals, or visiting the degree planner.
 * @extends api/base.BaseCollection
 * @memberOf api/log
 */
class UserInteractionCollection extends BaseCollection {

  /**
   * Creates the UserInteraction collection
   */
  constructor() {
    super('UserInteraction', new SimpleSchema({
      userID: { type: String },
      type: { type: String },
      typeData: { type: String },
      timestamp: { type: Date },
    }));
  }

  /**
   * Defines a user interaction record. An interaction object consists of a key-value pair: the key
   * representing the interaction type and the value representing any data associated with the interaction,
   * such as the ID for a newly added interest, or the name of a page that was visited.
   * @param userID The userID.
   * @param interaction The interaction type and any data associated with the interaction.
   * @param timestamp The time of interaction.
   */
  define({ userID, type, typeData, timestamp = moment().toDate() }) {
    this._collection.insert({ userID, type, typeData, timestamp });
  }

  /**
   * Removes all interaction documents from referenced user.
   * @param userID The user, either the ID or the username.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  removeUser(user) {
    const userID = Users.getID(user);
    this._collection.remove({ userID });
  }

  /**
   * Asserts that the userID belongs to a valid role when running the define and removeUser method
   * within this class.
   * @param userID The userID of the logged in user.
   */
  assertValidRoleForMethod(userID) {
    this._assertRole(userID, [ROLE.ADMIN, ROLE.STUDENT]);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    const problems = [];
    this.find().forEach(doc => {
      if (!Users.isDefined(doc.userID)) {
        problems.push(`Bad userID: ${doc.userID}`);
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
    const userID = doc.userID;
    const timestamp = doc.timestamp;
    const type = doc.type;
    const typeData = doc.typeData;
    return { userID, type, typeData, timestamp };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/log.UserInteractionCollection}
 * @memberOf api/log
 */
export const UserInteractions = new UserInteractionCollection();

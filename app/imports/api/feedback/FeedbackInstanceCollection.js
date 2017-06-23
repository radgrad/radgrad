import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';
import BaseCollection from '../base/BaseCollection';

/** @module api/feedback/FeedbackInstanceCollection */

/**
 * Each FeedbackInstance represents one recommendation or warning for a user.
 * @extends module:api/base/BaseCollection~BaseCollection
 */
class FeedbackInstanceCollection extends BaseCollection {

  /**
   * Creates the FeedbackInstance collection.
   */
  constructor() {
    super('FeedbackInstance', new SimpleSchema({
      userID: { type: SimpleSchema.RegEx.Id },
      functionName: String,
      description: String,
      feedbackType: String,
    }));
    this.feedbackTypes = ['Recommendation', 'Warning'];
    if (Meteor.server) {
      this._collection._ensureIndex({ _id: 1, userID: 1 });
    }
  }

  /**
   * Defines a new FeedbackInstance.
   * @example
   * FeedbackInstances.define({ user: 'joesmith',
   *                            functionName: 'checkPrerequisites',
   *                            description: 'The prerequisite ICS 211 for the class ICS 314 is not satisfied.',
   *                            feedbackType: 'Warning' });
   * @param { Object } User, functionName, description, and feedbackType are all required.
   * user must be a username or docID for a user (presumably a student).
   * functionName is the name of a feedback function.
   * Description is the string to appear as the feedback.
   * feedbackType is either 'Recommendation' or 'Warning'.
   * @throws {Meteor.Error} If user or feedbackType cannot be resolved.
   * @returns The newly created docID.
   */

  define({ user, functionName, description, feedbackType }) {
    // Validate Feedback and user.
    const userID = Users.getID(user);
    if (!_.includes(this.feedbackTypes, feedbackType)) {
      throw new Meteor.Error(`FeedbackInstances.define passed illegal feedbackType: ${feedbackType}`);
    }
    // Define and return the new FeedbackInstance
    const feedbackInstanceID = this._collection.insert({ userID, functionName, description, feedbackType });
    return feedbackInstanceID;
  }

  /**
   * Removes all FeedbackInstances associated with user and functionName.
   * @param user The user (typically a student).
   * @param functionName The FeedbackFunction name.
   */
  clear(user, functionName) {
    const userID = Users.getID(user);
    this._collection.remove({ userID, functionName });
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or
   * user.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  assertValidRoleForMethod(userId) {
    this._assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
  }

  /**
   * Depending on the logged in user publish only their FeedbackInstances. If
   * the user is in the Role.ADMIN then publish all FeedbackInstances. If the
   * system is in mockup mode publish all FeedbackInstances.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this._collectionName, function publish() {
        if (Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
          return instance._collection.find();
        }
        return instance._collection.find({ userID: this.userId });
      });
    }
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks userID
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Users.isDefined(doc.userID)) {
        problems.push(`Bad userID: ${doc.userID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the FeedbackInstance docID in a format acceptable to define().
   * @param docID The docID of a FeedbackInstance.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const user = Users.findSlugByID(doc.userID);
    const functionName = doc.functionName;
    const description = doc.description;
    const feedbackType = doc.feedbackType;
    return { user, functionName, description, feedbackType };
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const FeedbackInstances = new FeedbackInstanceCollection();

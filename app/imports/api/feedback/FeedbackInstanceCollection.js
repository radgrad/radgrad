import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';
import BaseCollection from '../base/BaseCollection';

/**
 * Each FeedbackInstance represents one recommendation or warning for a user.
 * @extends api/base.BaseCollection
 * @memberOf api/feedback
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
      retired: { type: Boolean, optional: true },
    }));
    this.WARNING = 'Warning';
    this.RECOMMENDATION = 'Recommendation';
    this.feedbackTypes = [this.WARNING, this.RECOMMENDATION];
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

  define({ user, functionName, description, feedbackType, retired }) {
    // Validate Feedback and user.
    const userID = Users.getID(user);
    if (!_.includes(this.feedbackTypes, feedbackType)) {
      throw new Meteor.Error(`FeedbackInstances.define passed illegal feedbackType: ${feedbackType}`,
        '', Error().stack);
    }
    // Define and return the new FeedbackInstance
    return this._collection.insert({ userID, functionName, description, feedbackType, retired });
  }

  /**
   * Update the feedback instance. Only a subset of fields can be updated.
   * @param docID the docID of the instance to update
   * @param user the new user, optional
   * @param description the new description, optional
   * @param feedbackType the new feedback type, optional
   * @param functionName the new function name, optional
   * @param retired the new retired status, optional
   */
  update(docID, { user, description, feedbackType, functionName, retired }) {
    this.assertDefined(docID);
    const updateData = {};
    if (user) {
      updateData.userID = user;
    }
    if (description) {
      updateData.description = description;
    }
    if (feedbackType) {
      updateData.feedbackType = feedbackType;
    }
    if (functionName) {
      updateData.functionName = functionName;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Returns the FeedbackInstance associated with the given user, functionName, and feedbackType.
   * @param user The user (slug or ID)
   * @param functionName The feedback function name.
   * @param feedbackType The feedback type.
   * @returns {any}
   */
  findFeedbackInstance(user, functionName, feedbackType) {
    const userID = Users.getID(user);
    return this._collection.findOne({ userID, functionName, feedbackType });
  }

  /**
   * Returns true if there exists a FeedbackInstance for the given user, functionName and feedbackType.
   * @param user the user (slug or ID)
   * @param functionName the feedback function name
   * @param feedbackType the feedback type.
   * @returns {boolean}
   */
  isFeedbackInstance(user, functionName, feedbackType) {
    return !!this.findFeedbackInstance(user, functionName, feedbackType);
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
   * Removes all FeedbackInstance documents referring to user.
   * @param user The user, either the ID or the username.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  removeUser(user) {
    const userID = Users.getID(user);
    this._collection.remove({ userID });
  }

  /**
   * Returns a cursor to all the Warnings associated with this user.
   * @param user The user of interest.
   */
  findWarnings(user) {
    const userID = Users.getID(user);
    return this._collection.find({ userID, feedbackType: this.WARNING });
  }

  /**
   * Returns a cursor to all the Warnings associated with this user.
   * @param user The user of interest.
   */
  findRecommendations(user) {
    const userID = Users.getID(user);
    return this._collection.find({ userID, feedbackType: this.RECOMMENDATION });
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
   * the user is in the Role.ADMIN then publish all FeedbackInstances.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      // eslint-disable-next-line meteor/audit-argument-checks
      Meteor.publish(this._collectionName, function publish(userID) {
        // console.log('FeedbackInstances.publish ', userID);
        if (!this.userId) {  // https://github.com/meteor/meteor/issues/9619
          return this.ready();
        }
        if (!userID) {
          return this.ready();
        }
        if (Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
          return instance._collection.find();
        }
        return instance._collection.find({ userID, retired: { $not: { $eq: true } } });
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
    this.find()
      .forEach(doc => {
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
    const user = Users.getProfile(doc.userID).username;
    const functionName = doc.functionName;
    const description = doc.description;
    const feedbackType = doc.feedbackType;
    const retired = doc.retired;
    return { user, functionName, description, feedbackType, retired };
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/feedback
 */
export const FeedbackInstances = new FeedbackInstanceCollection();

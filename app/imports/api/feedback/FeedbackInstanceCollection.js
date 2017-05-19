import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Feedbacks } from '../feedback/FeedbackCollection';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';
import BaseCollection from '../base/BaseCollection';
import { radgradCollections } from '../base/RadGradCollections';

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
      feedbackID: { type: SimpleSchema.RegEx.Id },
      userID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
      area: { type: String },
    }));
    this.INTERESTS = 'Interests';
    this.ICE = 'ICE';
    this.STAR = 'STAR';
    this.DegreePlan = 'DegreePlan';
    this.AREAS = [this.INTERESTS, this.ICE, this.STAR, this.DegreePlan];
    if (Meteor.server) {
      this._collection._ensureIndex({ _id: 1, userID: 1 });
    }
  }

  /**
   * Defines a new FeedbackInstance.
   * @example
   * FeedbackInstances.define({ feedback: 'CourseRecommendationsBasedOnInterests',
   *                            user: 'joesmith',
    *                           description: 'We recommend ICS 314 based on your interest in software engineering',
     *                          area: 'Interests' });
   * @param { Object }  object Requires feedback, the user slug or ID, and the feedback string returned from the
   * feedback function.
   * @throws {Meteor.Error} If the slugs or IDs cannot be resolved correctly.
   * @returns The newly created docID.
   */

  define({ feedback, user, description, area }) {
    // Validate Feedback and user.
    const feedbackID = Feedbacks.getID(feedback);
    const userID = Users.getID(user);
    // Define and return the new FeedbackInstance
    const feedbackInstanceID = this._collection.insert({ feedbackID, userID, description, area });
    return feedbackInstanceID;
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
        if (!!Meteor.settings.mockup || Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
          return instance._collection.find();
        }
        return instance._collection.find({ userID: this.userId });
      });
    }
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks feedbackID and userID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Feedbacks.isDefined(doc.feedbackID)) {
        problems.push(`Bad feedbackID: ${doc.feedbackID}`);
      }
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
    const feedback = Feedbacks.findSlugByID(doc.feedbackID);
    const user = Users.findSlugByID(doc.userID);
    const description = doc.description;
    const area = doc.area;
    return { feedback, user, description, area };
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const FeedbackInstances = new FeedbackInstanceCollection();
radgradCollections.push(FeedbackInstances);

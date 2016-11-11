import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Feedbacks } from '/imports/api/feedback/FeedbackCollection';
import { Users } from '/imports/api/user/UserCollection';
import BaseCollection from '/imports/api/base/BaseCollection';


/** @module FeedbackInstance */

/**
 * Each FeedbackInstance represents one recommendation or warning for a user.
 * @extends module:Base~BaseCollection
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
   * Depending on the logged in user publish only their WorkInstances. If
   * the user is in the Role.ADMIN then publish all WorkInstances. If the
   * system is in mockup mode publish all WorkInstances.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this._collectionName, function publish() {
        if (!!Meteor.settings.mockup || Roles.userIsInRole(this.userId, 'ADMIN')) {
          return instance._collection.find();
        }
        return instance._collection.find({ userID: this.userId });
      });
    }
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const FeedbackInstances = new FeedbackInstanceCollection();


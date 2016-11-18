import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { assertFeedbackType } from '/imports/api/feedback/FeedbackType';
// import { FeedbackFunctions } from '/imports/api/feedback/FeedbackFunctions';
// import { Meteor } from 'meteor/meteor';

/** @module Feedback */

/**
 * Feedback is the generalized representation for recommendations, warnings, and (perhaps in future) predictions.
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class FeedbackCollection extends BaseInstanceCollection {

  /**
   * Creates the Feedback collection.
   */
  constructor() {
    super('Feedback', new SimpleSchema({
      name: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
      feedbackType: { type: String },
    }));
  }

  /**
   * Defines a new Feedback with its name, slug, and description.
   * @example
   * Feedbacks.define({ name: 'Courses based on user interests',
   *                    slug: 'CourseRecommendationsBasedOnInterests',
   *                    description: 'Recommends courses to take not already in plan based on matching interests',
   *                    feedbackType: FeedbackType.RECOMMENDATION });
   * @param { Object } description Object with keys name, slug, description, feedbackType.
   * Slug must be globally unique and previously undefined.
   * You must define a static method in the class FeedbackFunctions with the same name as the slug that
   * implements the FeedbackFunction associated with this Feedback.
   * @throws { Meteor.Error } If the slug already exists or feedbackType is not a legal FeedbackType.
   * @returns The newly created docID.
   */
  define({ name, slug, description, feedbackType }) {
    // Validate slug, feedbackType, feedbackFunction.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    assertFeedbackType(feedbackType);
    // Make sure there's a defined FeedbackFunction with the same name as this slug.
    // if (!((typeof FeedbackFunctions[slug]) === 'function')) {
    //   throw new Meteor.Error(`No FeedbackFunction defined with name ${slug}`);
    // }
    const docID = this._collection.insert({ name, slugID, description, feedbackType });

    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, docID);
    return docID;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Feedbacks = new FeedbackCollection();

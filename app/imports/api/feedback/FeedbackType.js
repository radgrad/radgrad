/** @module FeedbackType */

/** Defines the legal strings used to represent FeedbackTypes in the system. */

import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';

/**
 * Provides FeedbackType.RECOMMENDATION, FeedbackType.WARNING.
 * @type { Object }
 */
export const FeedbackType = { RECOMMENDATION: 'Recommendation', WARNING: 'Warning' };

/**
 * Predicate for determining if a string is a defined FeedbackType.
 * @param { String } FeedbackType The FeedbackType.
 * @returns {boolean} True if FeedbackType is a defined FeedbackType.
 */
export function isFeedbackType(feedbackType) {
  return (typeof feedbackType) === 'string' && _.includes(_.values(FeedbackType), feedbackType);
}

/**
 * Ensures that feedbackType is a valid type of feedback.
 * @param feedbackType The feedback type.
 * @throws { Meteor.Error } If not a valid type of feedback.
 */
export function assertFeedbackType(feedbackType) {
  if (!isFeedbackType(feedbackType)) {
    throw new Meteor.Error(`${feedbackType} is not a defined feedbackType.`);
  }
}

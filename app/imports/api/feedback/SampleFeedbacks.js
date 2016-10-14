import { FeedbackType } from '/imports/api/feedback/FeedbackType';
import { Feedbacks } from '/imports/api/feedback/FeedbackCollection';

/** @module SampleFeedbacks */

/**
 * Creates a Feedback with the slug SampleFeedback and returns its docID.
 * @returns { String } The docID of the newly generated Feedback.
 */
export function makeSampleFeedback() {
  const slug = 'sampleFeedback';
  const name = 'Sample Feedback';
  const description = 'A feedback used solely for testing purposes.';
  const feedbackType = FeedbackType.RECOMMENDATION;
  return Feedbacks.define({ name, slug, description, feedbackType });
}

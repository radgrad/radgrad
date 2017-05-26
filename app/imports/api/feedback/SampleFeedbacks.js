import { FeedbackType } from '../feedback/FeedbackType';
import { Feedbacks } from '../feedback/FeedbackCollection';

/** @module api/feedback/SampleFeedbacks */

/**
 * Creates a Feedback with the slug SampleFeedback and returns its docID.
 * @returns { String } The docID of the newly generated Feedback.
 */
export function makeSampleFeedback() {
  const slug = 'sample-feedback';
  const name = 'Sample Feedback';
  const description = 'A feedback used solely for testing purposes.';
  const feedbackType = FeedbackType.RECOMMENDATION;
  return Feedbacks.define({ name, slug, description, feedbackType });
}

export function makeCourseRecommendationFeedback() {
  const name = 'Course recommendations based on interests';
  const slug = 'CourseRecommendationsBasedOnInterests';
  const description = 'These courses are recommended based upon your interests.';
  const feedbackType = FeedbackType.RECOMMENDATION;
  return Feedbacks.define({ name, slug, description, feedbackType });
}

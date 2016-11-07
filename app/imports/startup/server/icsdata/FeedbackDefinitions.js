/* eslint max-len: "off" */

/** @module FeedbackDefinitions */

/**
 * Provides an array containing Feedback recommendation definitions.
 */
export const recommendationFeedbackDefinitions = [
  {
    name: 'ICE innovation points',
    slug: 'iceInnovationPoints',
    description: 'Recommendation for ICE innovation points.',
    feedbackType: 'Recommendation',
  },
  {
    name: 'ICE competency points',
    slug: 'iceCompetencyPoints',
    description: 'Recommendation for ICE competency points.',
    feedbackType: 'Recommendation',
  },
  {
    name: 'ICE experience points',
    slug: 'iceExperiencePoints',
    description: 'Recommendation for ICE experience points.',
    feedbackType: 'Recommendation',
  },
  {
    name: 'Upload STAR data',
    slug: 'updateStarData',
    description: 'See your ICS advisor to upload STAR data',
    feedbackType: 'Recommendation',
  },
  {
    name: 'Course recommendations based on interests',
    slug: 'CourseRecommendationsBasedOnInterests',
    description: 'These courses are recommended based upon your interests.',
    feedbackType: 'Recommendation',
  },
];

/**
 * Provides an array containing Feedback warning definitions.
 */
export const warningFeedbackDefinitions = [
  {
    name: 'Required course missing',
    slug: 'requiredCourseMissing',
    description: 'A required course is missing.',
    feedbackType: 'Warning',
  },
  {
    name: 'Prerequisite missing',
    slug: 'prerequisiteMissing',
    description: 'A prerequisite course is missing.',
    feedbackType: 'Warning',
  },
  {
    name: 'Semester overloaded',
    slug: 'semesterOverloaded',
    description: 'Semester appears overloaded.',
    feedbackType: 'Warning',
  },
  {
    name: 'Course not likely to be offered',
    slug: 'courseNotOffered',
    description: 'Your plan include a course that is not offered in the semester',
    feedbackType: 'Warning',
  },
];

/**
 * Provides an array containing sample FeedbackInstances.
 */
export const feedbackInstances = [
  {
    feedback: 'CourseRecommendationsBasedOnInterests',
    user: 'alfred',
    description: 'We recommend ICS 314 based on your interest in software engineering',
  },
  {
    feedback: 'iceInnovationPoints',
    user: 'alfred',
    description: 'You need 22 more Innovation points in your plan to get to 100.',
  },
  {
    feedback: 'updateStarData',
    user: 'alfred',
    description: 'See your ICS advisor to upload STAR data from Spring 2016.',
  },
  {
    feedback: 'requiredCourseMissing',
    user: 'alfred',
    description: 'Required course ICS 212 does not appear in your degree plan.',
  },
  {
    feedback: 'semesterOverloaded',
    user: 'alfred',
    description: 'Fall 2017 appears overloaded with course work.',
  },
  {
    feedback: 'courseNotOffered',
    user: 'alfred',
    description: 'Your plan includes ICS 451 in Fall 2017, but it is unlikely to occur then.',
  },
  {
    feedback: 'iceInnovationPoints',
    user: 'dani',
    description: 'You need 22 more Innovation points in your plan to get to 100.',
  },
  {
    feedback: 'iceCompetencyPoints',
    user: 'dani',
    description: 'You need 7 more Innovation points in your plan to get to 100.',
  },
  {
    feedback: 'updateStarData',
    user: 'dani',
    description: 'See your ICS advisor to upload STAR data from Spring 2016.',
  },
];

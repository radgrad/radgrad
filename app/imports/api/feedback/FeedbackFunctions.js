// import { check } from 'meteor/check';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { calculateOpportunityCompatibility, getRandomInt } from '../opportunity/OpportunityUtilities';
import { Feedbacks } from './FeedbackCollection';
import { FeedbackInstances } from './FeedbackInstanceCollection';
import { FeedbackType } from './FeedbackType';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';

/** @module FeedbackFunctions */

const feedbackDefinitions = [
  {
    name: 'Course recommendations based on interests',
    slug: 'CourseRecommendationsBasedOnInterests',
    description: 'These courses are recommended based upon your interests.',
    feedbackType: 'Recommendation',
  },
  {
    name: 'Opportunity recommendations based on interests',
    slug: 'OpportunityRecommendationsBasedOnInterests',
    description: 'These opportunities are recommended based upon your interests.',
    feedbackType: 'Recommendation',
  },
  {
    name: 'Course not likely to be offered',
    slug: 'courseNotOffered',
    description: 'Your plan include a course that is not offered in the semester',
    feedbackType: 'Warning',
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
    name: 'ICE innovation points',
    slug: 'iceInnovationPoints',
    description: 'Recommendation for ICE innovation points.',
    feedbackType: 'Recommendation',
  },
  {
    name: 'Prerequisite missing',
    slug: 'prerequisiteMissing',
    description: 'A prerequisite course is missing.',
    feedbackType: 'Warning',
  },
  {
    name: 'Required course missing',
    slug: 'requiredCourseMissing',
    description: 'A required course is missing.',
    feedbackType: 'Warning',
  },
  {
    name: 'Semester overloaded',
    slug: 'semesterOverloaded',
    description: 'Semester appears overloaded.',
    feedbackType: 'Warning',
  },
  {
    name: 'Upload STAR data',
    slug: 'updateStarData',
    description: 'See your ICS advisor to upload STAR data',
    feedbackType: 'Recommendation',
  },
];

function buildCurrentSemesterChoices(studentID) {
  const choices = {};
  let max = 0;
  const currentSemesterID = Semesters.getCurrentSemester();
  const opportunities = Opportunities.find({ semesterIDs: currentSemesterID }).fetch();
  _.map(opportunities, (opportunity) => {
    const score = calculateOpportunityCompatibility(opportunity._id, studentID);
    if (score > max) {
      max = score;
    }
    if (!choices[score]) {
      choices[score] = [];
    }
    choices[score].push(opportunity);
  });
  choices.max = max;
  return choices;
}

function bestStudentSemesterOpportunities(studentID) {
  const choices = buildCurrentSemesterChoices(studentID);
  return choices[choices.max];
};

/**
 * A class containing Feedback functions. Each Feedback function is a method on the singleton instance
 * FeedbackFunctions.
 * @example
 * import { FeedbackFunctions } from '/imports/api/feedback/FeedbackFunctions';
 * :
 * :
 * FeedbackFunctions.recommendedCoursesThisSemesterByInterest(studentID);
 * @class FeedbackFunctions
 */
export class FeedbackFunctionClass {

  /**
   * Creates the FeedbackFunction instance.
   */
  constructor() {
    // ensure the Feedback definitions exist before we work.
    _.map(feedbackDefinitions, (definition) => {
      if (Feedbacks.find({ name: definition.name }).count() === 0) {
        Feedbacks.define(definition);
      }
    });
  }

  _clearFeedbackInstances(studentID, area) {
    const userID = studentID;
    const instances = FeedbackInstances.find({ userID, area }).fetch();
    _.map(instances, (fi) => {
      FeedbackInstances.removeIt(fi._id);
    });
  }

  generateRecommendedOpportunities(studentID) {
    const feedback = Feedbacks.findDoc({ name: 'Opportunity recommendations based on interests' });
    const feedbackSlug = Slugs.getEntityID(feedback.slugID, 'Feedback');
    this._clearFeedbackInstances(studentID, feedbackSlug);

    const bestChoices = bestStudentSemesterOpportunities(studentID);
    console.log(bestChoices);
    _.map(bestChoices, (opp) => {

    });
  }
}

/**
 * Singleton instance for all FeedbackFunctions.
 * @type {FeedbackFunctionClass}
 */
export const FeedbackFunctions = new FeedbackFunctionClass();

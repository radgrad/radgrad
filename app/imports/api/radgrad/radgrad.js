import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { AdvisorLogs } from '../log/AdvisorLogCollection.js';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection.js';
import { CourseInstances } from '../course/CourseInstanceCollection.js';
import { Feeds } from '../feed/FeedCollection.js';
import { Feedbacks } from '../feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection.js';
import { HelpMessages } from '../help/HelpMessageCollection';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { Interests } from '../interest/InterestCollection.js';
import { InterestTypes } from '../interest/InterestTypeCollection.js';
import { MentorAnswers } from '../mentor/MentorAnswerCollection.js';
import { MentorQuestions } from '../mentor/MentorQuestionCollection.js';
import { MentorProfiles } from '../mentor/MentorProfileCollection.js';
import { Opportunities } from '../opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../opportunity/OpportunityTypeCollection.js';
import { PlanChoices } from '../degree-plan/PlanChoiceCollection';
import { PublicStats } from '../public-stats/PublicStatsCollection';
import { Reviews } from '../review/ReviewCollection';
import { Semesters } from '../semester/SemesterCollection.js';
import { Slugs } from '../slug/SlugCollection.js';
import { Teasers } from '../teaser/TeaserCollection';
import { Users } from '../user/UserCollection';
import { ValidUserAccounts } from '../user/ValidUserAccountCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection.js';

/** @module api/base/RadGrad */

/**
 * RadGrad is an object intended to provide simple, global state information about the API.
 * @type { Object }
 */
export const RadGrad = {};

/**
 * RadGrad.collections provides an alphabetized list of all collection class instances in the system.
 * @type {Object[]}
 */
RadGrad.collections = [
  AcademicPlans,
  AcademicYearInstances,
  AdvisorLogs,
  CareerGoals,
  Courses,
  CourseInstances,
  Feeds,
  Feedbacks,
  FeedbackInstances,
  HelpMessages,
  DesiredDegrees,
  Interests,
  InterestTypes,
  MentorAnswers,
  MentorQuestions,
  MentorProfiles,
  Opportunities,
  OpportunityInstances,
  OpportunityTypes,
  PlanChoices,
  PublicStats,
  Reviews,
  Semesters,
  Slugs,
  Teasers,
  Users,
  ValidUserAccounts,
  VerificationRequests,
];

/**
 * A list of collection class instances in the order required for them to be sequentially loaded from a snapshot file.
 * Note that not all collection class instances get initialized from a snapshot file.
 * Currently, Slugs, AcademicYearInstances, and PublicStats collections are not initialized and thus are not in
 * this list.
 * @type {Object[]}
 */
RadGrad.collectionLoadSequence = [
  Semesters,
  HelpMessages,
  InterestTypes,
  Interests,
  CareerGoals,
  DesiredDegrees,
  ValidUserAccounts,
  Users,
  OpportunityTypes,
  Opportunities,
  Courses,
  Feedbacks,
  Teasers,
  CourseInstances,
  OpportunityInstances,
  FeedbackInstances,
  VerificationRequests,
  Feeds,
  AdvisorLogs,
  MentorProfiles,
  MentorQuestions,
  MentorAnswers,
  Reviews,
  AcademicPlans,
  PlanChoices,
];

import { AcademicPlans } from '../../api/degree-plan/AcademicPlanCollection';
import { AcademicYearInstances } from '../../api/degree-plan/AcademicYearInstanceCollection';
import { AdvisorLogs } from '../../api/log/AdvisorLogCollection.js';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { Courses } from '../../api/course/CourseCollection.js';
import { CourseInstances } from '../../api/course/CourseInstanceCollection.js';
import { Feeds } from '../../api/feed/FeedCollection.js';
import { Feedbacks } from '../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../api/feedback/FeedbackInstanceCollection.js';
import { HelpMessages } from '../../api/help/HelpMessageCollection';
import { DesiredDegrees } from '../../api/degree-plan/DesiredDegreeCollection';
import { Interests } from '../../api/interest/InterestCollection.js';
import { InterestTypes } from '../../api/interest/InterestTypeCollection.js';
import { MentorAnswers } from '../../api/mentor/MentorAnswerCollection.js';
import { MentorQuestions } from '../../api/mentor/MentorQuestionCollection.js';
import { MentorProfiles } from '../../api/mentor/MentorProfileCollection.js';
import { Opportunities } from '../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection.js';
import { PlanChoices } from '../../api/degree-plan/PlanChoiceCollection';
import { PublicStats } from '../../api/public-stats/PublicStatsCollection';
import { Reviews } from '../../api/review/ReviewCollection';
import { Semesters } from '../../api/semester/SemesterCollection.js';
import { Slugs } from '../../api/slug/SlugCollection.js';
import { Teasers } from '../../api/teaser/TeaserCollection';
import { Users } from '../../api/user/UserCollection';
import { ValidUserAccounts } from '../../api/user/ValidUserAccountCollection';
import { VerificationRequests } from '../../api/verification/VerificationRequestCollection.js';

/** @module api/base/RadGrad */

/**
 * RadGrad is an object intended to provide simple, global state information about the API.
 * @type { Object }
 */
export const RadGrad = {};

/**
 * RadGrad.collections provides an alphabetized list of all collection class instances in the system.
 * @type {[*]}
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
 * @type {[*]}
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

import { AdvisorLogs } from '/imports/api/log/AdvisorLogCollection';
import { CareerGoals } from '/imports/api/career/CareerGoalCollection';
import { Courses } from '/imports/api/course/CourseCollection';
import { CourseInstances } from '/imports/api/course/CourseInstanceCollection';
import { DesiredDegrees } from '/imports/api/degree-plan/DesiredDegreeCollection';
import { Feeds } from '/imports/api/feed/FeedCollection';
import { Feedbacks } from '/imports/api/feedback/FeedbackCollection';
import { FeedbackInstances } from '/imports/api/feedback/FeedbackInstanceCollection';
import { HelpMessages } from '/imports/api/help/HelpMessageCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { InterestTypes } from '/imports/api/interest/InterestTypeCollection';
import { MentorAnswers } from '/imports/api/mentor/MentorAnswerCollection';
import { MentorQuestions } from '/imports/api/mentor/MentorQuestionCollection';
import { MentorProfiles } from '/imports/api/mentor/MentorProfileCollection';
import { OpportunityTypes } from '/imports/api/opportunity/OpportunityTypeCollection';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '/imports/api/opportunity/OpportunityInstanceCollection';
import { Reviews } from '/imports/api/review/ReviewCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { Teasers } from '/imports/api/teaser/TeaserCollection';
import { Users } from '/imports/api/user/UserCollection';
import { VerificationRequests } from '/imports/api/verification/VerificationRequestCollection';
import { AcademicYearInstances } from '/imports/api/degree-plan/AcademicYearInstanceCollection';
import { PlanChoices } from '/imports/api/degree-plan/PlanChoiceCollection';
import { AcademicPlans } from '/imports/api/degree-plan/AcademicPlanCollection';

/** @module api/base/BaseUtilities */

/**
 * Deletes all RadGrad data model entities. (Hopefully).
 */
export function removeAllEntities() {
  CareerGoals.removeAll();
  Courses.removeAll();
  CourseInstances.removeAll();
  DesiredDegrees.removeAll();
  Feeds.removeAll();
  Feedbacks.removeAll();
  FeedbackInstances.removeAll();
  HelpMessages.removeAll();
  Interests.removeAll();
  InterestTypes.removeAll();
  AdvisorLogs.removeAll();
  MentorAnswers.removeAll();
  MentorQuestions.removeAll();
  MentorProfiles.removeAll();
  Opportunities.removeAll();
  OpportunityInstances.removeAll();
  OpportunityTypes.removeAll();
  Reviews.removeAll();
  Semesters.removeAll();
  Teasers.removeAll();
  Users.removeAll();
  VerificationRequests.removeAll();
  AcademicYearInstances.removeAll();
  PlanChoices.removeAll();
  AcademicPlans.removeAll();
//  Slugs.removeAll();
}

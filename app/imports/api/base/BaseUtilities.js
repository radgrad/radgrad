import { AdvisorLogs } from '../log/AdvisorLogCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { Feeds } from '../feed/FeedCollection';
import { Feedbacks } from '../feedback/FeedbackCollection';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { HelpMessages } from '../help/HelpMessageCollection';
import { Interests } from '../interest/InterestCollection';
import { InterestTypes } from '../interest/InterestTypeCollection';
import { MentorAnswers } from '../mentor/MentorAnswerCollection';
import { MentorQuestions } from '../mentor/MentorQuestionCollection';
import { MentorProfiles } from '../mentor/MentorProfileCollection';
import { OpportunityTypes } from '../opportunity/OpportunityTypeCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Reviews } from '../review/ReviewCollection';
import { Semesters } from '../semester/SemesterCollection';
// import { Slugs } from '../slug/SlugCollection';
import { Teasers } from '../teaser/TeaserCollection';
import { Users } from '../user/UserCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { PlanChoices } from '../degree-plan/PlanChoiceCollection';
import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';

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

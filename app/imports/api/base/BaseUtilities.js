import { AdvisorLogs } from '/imports/api/log/AdvisorLogCollection';
import { CareerGoals } from '/imports/api/career/CareerGoalCollection';
import { Courses } from '/imports/api/course/CourseCollection';
import { CourseInstances } from '/imports/api/course/CourseInstanceCollection';
import { DesiredDegrees } from '/imports/api/degree/DesiredDegreeCollection';
import { Feed } from '/imports/api/feed/FeedCollection';
import { Feedbacks } from '/imports/api/feedback/FeedbackCollection';
import { FeedbackInstances } from '/imports/api/feedback/FeedbackInstanceCollection';
import { HelpMessages } from '/imports/api/help/HelpMessageCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { InterestTypes } from '/imports/api/interest/InterestTypeCollection';
import { MentorAnswers } from '/imports/api/mentorspace/MentorAnswersCollection';
import { MentorQuestions } from '/imports/api/mentorspace/MentorQuestionsCollection';
import { OpportunityTypes } from '/imports/api/opportunity/OpportunityTypeCollection';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '/imports/api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { StarDataLogs } from '/imports/api/star/StarDataLogCollection';
import { Teasers } from '/imports/api/teaser/TeaserCollection';
import { Users } from '/imports/api/user/UserCollection';
import { VerificationRequests } from '/imports/api/verification/VerificationRequestCollection';
import { WorkInstances } from '/imports/api/work/WorkInstanceCollection';
import { AcademicYearInstances } from '/imports/api/year/AcademicYearInstanceCollection';

/** @module BaseUtilities */

/**
 * Deletes all RadGrad data model entities. (Hopefully).
 */
export function removeAllEntities() {
  CareerGoals.removeAll();
  Courses.removeAll();
  CourseInstances.removeAll();
  DesiredDegrees.removeAll();
  Feed.removeAll();
  Feedbacks.removeAll();
  FeedbackInstances.removeAll();
  HelpMessages.removeAll();
  Interests.removeAll();
  InterestTypes.removeAll();
  AdvisorLogs.removeAll();
  MentorAnswers.removeAll();
  MentorQuestions.removeAll();
  Opportunities.removeAll();
  OpportunityInstances.removeAll();
  OpportunityTypes.removeAll();
  Semesters.removeAll();
  Slugs.removeAll();
  StarDataLogs.removeAll();
  Teasers.removeAll();
  Users.removeAll();
  VerificationRequests.removeAll();
  WorkInstances.removeAll();
  AcademicYearInstances.removeAll();
}


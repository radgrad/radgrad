import { CareerGoals } from '/imports/api/career/CareerGoalCollection';
import { Courses } from '/imports/api/course/CourseCollection';
import { CourseInstances } from '/imports/api/course/CourseInstanceCollection';
import { DesiredDegrees } from '/imports/api/degree/DesiredDegreeCollection';
import { Feedbacks } from '/imports/api/feedback/FeedbackCollection';
import { FeedbackInstances } from '/imports/api/feedback/FeedbackInstanceCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { InterestTypes } from '/imports/api/interest/InterestTypeCollection';
import { OpportunityTypes } from '/imports/api/opportunity/OpportunityTypeCollection';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '/imports/api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { Users } from '/imports/api/user/UserCollection';
import { WorkInstances } from '/imports/api/work/WorkInstanceCollection';

/** @module BaseUtilities */

/**
 * Deletes all RadGrad data model entities: CareerGoals, Courses, CourseInstances, DesiredDegrees,
 * Feedbacks, FeedbackInstances, Interests, InterestTypes, OpportunityTypes, Opportunities, OpportunityInstances,
 * Semesters, Slugs, Users, and WorkInstances.
 * This function is useful for testing purposes only.
 */
export function removeAllEntities() {
  Users.removeAll();

  FeedbackInstances.removeAll();
  Feedbacks.removeAll();

  DesiredDegrees.removeAll();

  CareerGoals.removeAll();

  WorkInstances.removeAll();

  CourseInstances.removeAll();
  Courses.removeAll();

  OpportunityInstances.removeAll();
  Opportunities.removeAll();
  OpportunityTypes.removeAll();

  Interests.removeAll();
  InterestTypes.removeAll();

  Semesters.removeAll();

  Slugs.removeAll();
}

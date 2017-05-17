import { _ } from 'meteor/erasaur:meteor-lodash';
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
import { StarDataLogs } from '/imports/api/star/StarDataLogCollection';
import { Teasers } from '/imports/api/teaser/TeaserCollection';
import { Users } from '/imports/api/user/UserCollection';
import { VerificationRequests } from '/imports/api/verification/VerificationRequestCollection';
import { AcademicYearInstances } from '/imports/api/year/AcademicYearInstanceCollection';
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
  Slugs.removeAll();
  StarDataLogs.removeAll();
  Teasers.removeAll();
  Users.removeAll();
  VerificationRequests.removeAll();
  AcademicYearInstances.removeAll();
  PlanChoices.removeAll();
  AcademicPlans.removeAll();
}

export function clientRemoveAllEntities() {
  let items = CareerGoals.find().fetch();
  _.map(items, (i) => {
    CareerGoals.removeIt(i._id);
  });
  items = Courses.find().fetch();
  _.map(items, (i) => {
    Courses.removeIt(i._id);
  });
  items = CourseInstances.find().fetch();
  _.map(items, (i) => {
    CourseInstances.removeIt(i._id);
  });
  items = DesiredDegrees.find().fetch();
  _.map(items, (i) => {
    DesiredDegrees.removeIt(i._id);
  });
  items = Feeds.find().fetch();
  _.map(items, (i) => {
    Feeds.removeIt(i._id);
  });
  items = Feedbacks.find().fetch();
  _.map(items, (i) => {
    Feedbacks.removeIt(i._id);
  });
  items = FeedbackInstances.find().fetch();
  _.map(items, (i) => {
    FeedbackInstances.removeIt(i._id);
  });
  items = HelpMessages.find().fetch();
  _.map(items, (i) => {
    HelpMessages.removeIt(i._id);
  });
  items = Interests.find().fetch();
  _.map(items, (i) => {
    Interests.removeIt(i._id);
  });
  items = InterestTypes.find().fetch();
  _.map(items, (i) => {
    InterestTypes.removeIt(i._id);
  });
  items = AdvisorLogs.find().fetch();
  _.map(items, (i) => {
    AdvisorLogs.removeIt(i._id);
  });
  items = MentorAnswers.find().fetch();
  _.map(items, (i) => {
    MentorAnswers.removeIt(i._id);
  });
  items = MentorQuestions.find().fetch();
  _.map(items, (i) => {
    MentorQuestions.removeIt(i._id);
  });
  items = MentorProfiles.find().fetch();
  _.map(items, (i) => {
    MentorProfiles.removeIt(i._id);
  });
  items = Opportunities.find().fetch();
  _.map(items, (i) => {
    Opportunities.removeIt(i._id);
  });
  items = OpportunityInstances.find().fetch();
  _.map(items, (i) => {
    OpportunityInstances.removeIt(i._id);
  });
  items = OpportunityTypes.find().fetch();
  _.map(items, (i) => {
    OpportunityTypes.removeIt(i._id);
  });
  items = Reviews.find().fetch();
  _.map(items, (i) => {
    Reviews.removeIt(i._id);
  });
  items = Semesters.find().fetch();
  _.map(items, (i) => {
    Semesters.removeIt(i._id);
  });
  items = Slugs.find().fetch();
  _.map(items, (i) => {
    Slugs.removeIt(i._id);
  });
  items = StarDataLogs.find().fetch();
  _.map(items, (i) => {
    StarDataLogs.removeIt(i._id);
  });
  items = Teasers.find().fetch();
  _.map(items, (i) => {
    Teasers.removeIt(i._id);
  });
  items = Users.find().fetch();
  _.map(items, (i) => {
    Users.removeIt(i._id);
  });
  items = VerificationRequests.find().fetch();
  _.map(items, (i) => {
    VerificationRequests.removeIt(i._id);
  });
  items = AcademicYearInstances.find().fetch();
  _.map(items, (i) => {
    AcademicYearInstances.removeIt(i._id);
  });
  items = PlanChoices.find().fetch();
  _.map(items, (i) => {
    PlanChoices.removeIt(i._id);
  });
  items = AcademicPlans.find().fetch();
  _.map(items, (i) => {
    AcademicPlans.removeIt(i._id);
  });
}

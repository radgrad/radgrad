import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Users } from '../../../api/user/UserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';

Template.Admin_DataModel_Menu.helpers({
  academicPlanCount() {
    return AcademicPlans.count();
  },
  academicPlansRouteName() {
    return RouteNames.adminDataModelAcademicPlansPageRouteName;
  },
  academicYearInstanceCount() {
    return AcademicYearInstances.count();
  },
  academicYearInstancesRouteName() {
    return RouteNames.adminDataModelAcademicYearInstancesPageRouteName;
  },
  advisorLogCount() {
    return AdvisorLogs.count();
  },
  advisorLogsRouteName() {
    return RouteNames.adminDataModelAdvisorLogsPageRouteName;
  },
  careerGoalCount() {
    return CareerGoals.count();
  },
  careerGoalsRouteName() {
    return RouteNames.adminDataModelCareerGoalsPageRouteName;
  },
  courseInstanceCount() {
    return CourseInstances.count();
  },
  courseInstancesRouteName() {
    return RouteNames.adminDataModelCourseInstancesPageRouteName;
  },
  courseCount() {
    return Courses.count();
  },
  coursesRouteName() {
    return RouteNames.adminDataModelCoursesPageRouteName;
  },
  desiredDegreeCount() {
    return DesiredDegrees.count();
  },
  desiredDegreesRouteName() {
    return RouteNames.adminDataModelDesiredDegreesPageRouteName;
  },
  feedbackInstanceCount() {
    return FeedbackInstances.count();
  },
  feedbackInstancesRouteName() {
    return RouteNames.adminDataModelFeedbackInstancesPageRouteName;
  },
  feedCount() {
    return Feeds.count();
  },
  feedsRouteName() {
    return RouteNames.adminDataModelFeedsPageRouteName;
  },
  helpMessageCount() {
    return HelpMessages.count();
  },
  helpMessagesRouteName() {
    return RouteNames.adminDataModelHelpMessagesPageRouteName;
  },
  interestCount() {
    return Interests.count();
  },
  interestsRouteName() {
    return RouteNames.adminDataModelInterestsPageRouteName;
  },
  interestTypeCount() {
    return InterestTypes.count();
  },
  interestTypesRouteName() {
    return RouteNames.adminDataModelInterestTypesPageRouteName;
  },
  mentorAnswerCount() {
    return MentorAnswers.count();
  },
  mentorAnswerRouteName() {
    return RouteNames.adminDataModelMentorAnswersPageRouteName;
  },
  mentorQuestionCount() {
    return MentorQuestions.count();
  },
  mentorQuestionRouteName() {
    return RouteNames.adminDataModelMentorQuestionsPageRouteName;
  },
  opportunityCount() {
    return Opportunities.count();
  },
  opportunitiesRouteName() {
    return RouteNames.adminDataModelOpportunitiesPageRouteName;
  },
  opportunityInstanceCount() {
    return OpportunityInstances.count();
  },
  opportunityInstancesRouteName() {
    return RouteNames.adminDataModelOpportunityInstancesPageRouteName;
  },
  opportunityTypesRouteName() {
    return RouteNames.adminDataModelOpportunityTypesPageRouteName;
  },
  opportunityTypeCount() {
    return OpportunityTypes.count();
  },
  planChoiceCount() {
    return PlanChoices.count();
  },
  planChoiceRouteName() {
    return RouteNames.adminDataModelPlanChoicePageRouteName;
  },
  reviewCount() {
    return Reviews.count();
  },
  reviewsRouteName() {
    return RouteNames.adminDataModelReviewsPageRouteName;
  },
  semesterCount() {
    return Semesters.count();
  },
  semestersRouteName() {
    return RouteNames.adminDataModelSemestersPageRouteName;
  },
  slugCount() {
    return Slugs.count();
  },
  slugsRouteName() {
    return RouteNames.adminDataModelSlugsPageRouteName;
  },
  teaserCount() {
    return Teasers.count();
  },
  teasersRouteName() {
    return RouteNames.adminDataModelTeasersPageRouteName;
  },
  userCount() {
    return Users.count();
  },
  usersRouteName() {
    return RouteNames.adminDataModelUsersPageRouteName;
  },
  verificationRequestCount() {
    return VerificationRequests.count();
  },
  verificationRequestRouteName() {
    return RouteNames.adminDataModelVerificationRequestsPageRouteName;
  },
});

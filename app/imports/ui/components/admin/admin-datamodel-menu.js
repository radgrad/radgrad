import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Admin_DataModel_Menu.helpers({
  academicPlansRouteName() {
    return RouteNames.adminDataModelAcademicPlansPageRouteName;
  },
  academicYearInstancesRouteName() {
    return RouteNames.adminDataModelAcademicYearInstancesPageRouteName;
  },
  advisorLogsRouteName() {
    return RouteNames.adminDataModelAdvisorLogsPageRouteName;
  },
  careerGoalsRouteName() {
    return RouteNames.adminDataModelCareerGoalsPageRouteName;
  },
  courseInstancesRouteName() {
    return RouteNames.adminDataModelCourseInstancesPageRouteName;
  },
  coursesRouteName() {
    return RouteNames.adminDataModelCoursesPageRouteName;
  },
  desiredDegreesRouteName() {
    return RouteNames.adminDataModelDesiredDegreesPageRouteName;
  },
  feedbackInstancesRouteName() {
    return RouteNames.adminDataModelFeedbackInstancesPageRouteName;
  },
  feedsRouteName() {
    return RouteNames.adminDataModelFeedsPageRouteName;
  },
  helpMessagesRouteName() {
    return RouteNames.adminDataModelHelpMessagesPageRouteName;
  },
  interestsRouteName() {
    return RouteNames.adminDataModelInterestsPageRouteName;
  },
  interestTypesRouteName() {
    return RouteNames.adminDataModelAdvisorLogsPageRouteName;
  },
  mentorAnswerRouteName() {
    return RouteNames.adminDataModelMentorAnswersPageRouteName;
  },
  mentorQuestionRouteName() {
    return RouteNames.adminDataModelMentorQuestionsPageRouteName;
  },
  opportunitiesRouteName() {
    return RouteNames.adminDataModelOpportunitiesPageRouteName;
  },
  opportunityInstancesRouteName() {
    return RouteNames.adminDataModelOpportunityInstancesPageRouteName;
  },
  planChoiceRouteName() {
    return RouteNames.adminDataModelPlanChoicePageRouteName;
  },
  reviewsRouteName() {
    return RouteNames.adminDataModelReviewsPageRouteName;
  },
  semestersRouteName() {
    return RouteNames.adminDataModelSemestersPageRouteName;
  },
  slugsRouteName() {
    return RouteNames.adminDataModelSlugsPageRouteName;
  },
  teasersRouteName() {
    return RouteNames.adminDataModelTeasersPageRouteName;
  },
  usersRouteName() {
    return RouteNames.adminDataModelUsersPageRouteName;
  },
  verificationRequestRouteName() {
    return RouteNames.adminDataModelVerificationRequestsPageRouteName;
  },
});

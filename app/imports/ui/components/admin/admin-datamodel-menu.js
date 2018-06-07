import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Admin_DataModel_Menu.helpers({
  careerGoalsRouteName() {
    return RouteNames.adminDataModelCareerGoalsPageRouteName;
  },
  courseInstancesRouteName() {
    return RouteNames.adminDataModelCourseInstancesPageRouteName;
  },
  coursesRouteName() {
    return RouteNames.adminDataModelCoursesPageRouteName;
  },
  helpMessagesRouteName() {
    return RouteNames.adminDataModelHelpMessagesPageRouteName;
  },
  interestsRouteName() {
    return RouteNames.adminDataModelInterestsPageRouteName;
  },
  mentorAnswerRouteName() {
    return RouteNames.adminDataModelMentorAnswerPageRouteName;
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
  teasersRouteName() {
    return RouteNames.adminDataModelTeasersPageRouteName;
  },
  usersRouteName() {
    return RouteNames.adminDataModelUsersPageRouteName;
  },
});

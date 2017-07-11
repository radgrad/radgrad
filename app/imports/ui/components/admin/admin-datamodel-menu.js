import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

// /** @module ui/components/admin/Admin_DataModel_Menu */

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
  opportunitiesRouteName() {
    return RouteNames.adminDataModelOpportunitiesPageRouteName;
  },
  opportunityInstancesRouteName() {
    return RouteNames.adminDataModelOpportunityInstancesPageRouteName;
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

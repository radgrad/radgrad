import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Admin_DataModel_Menu.helpers({
  careerGoalsRouteName() {
    return RouteNames.adminDataModelCareerGoalsPageRouteName;
  },
  coursesRouteName() {
    return RouteNames.adminDataModelCoursesPageRouteName;
  },
});

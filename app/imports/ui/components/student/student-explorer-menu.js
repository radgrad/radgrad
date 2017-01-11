import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Student_Explorer_Menu.helpers({
  careerGoalsRouteName() {
    return RouteNames.studentExplorerCareerGoalsPageRouteName;
  },
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  degreesRouteName() {
    return RouteNames.studentExplorerDegreesPageRouteName;
  },
  interestsRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
});

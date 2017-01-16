import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Student_Home_Menu.helpers({
  studentHomePageRouteName() {
    return RouteNames.studentHomePageRouteName;
  },
  studentHomeAboutMePageRouteName() {
    return RouteNames.studentHomeAboutMePageRouteName;
  },
  studentHomeIcePageRouteName() {
    return RouteNames.studentHomeIcePageRouteName;
  },
  studentHomeLevelsPageRouteName() {
    return RouteNames.studentHomeLevelsPageRouteName;
  },
});
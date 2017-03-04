import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

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
  studentHomeLogPageRouteName() {
    return RouteNames.studentHomeLogPageRouteName;
  },
  getRouteName() {
    const routeName = FlowRouter.getRouteName();
    switch (routeName) {
      case RouteNames.studentHomePageRouteName:
        return 'Home';
      case RouteNames.studentHomeAboutMePageRouteName:
        return 'About Me';
      case RouteNames.studentHomeIcePageRouteName:
        return 'ICE Points';
      case RouteNames.studentHomeLevelsPageRouteName:
        return 'Levels';
      default:
        return 'Menu';
    }
  },
});

Template.Student_Home_Menu.onRendered(function studentHomeOnRendered() {
  this.$('.ui.dropdown').dropdown();
});

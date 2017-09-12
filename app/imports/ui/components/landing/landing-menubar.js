import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '../../../startup/client/router.js';

Template.Landing_Menubar.onCreated(function landingMenubarOnCreated() {
  // add your statement here
});

Template.Landing_Menubar.helpers({
  adminHomePageRouteName() {
    return RouteNames.adminHomePageRouteName;
  },
  advisorStudentConfigurationPageRouteName() {
    return RouteNames.advisorStudentConfigurationPageRouteName;
  },
  checkLanding() {
    const routeName = FlowRouter.current().route.name;
    if (routeName === 'Landing_Page' || routeName === 'Landing_Explorer_Page') {
      return true;
    }
    return false;
  },
  facultyHomePageRouteName() {
    return RouteNames.facultyHomePageRouteName;
  },
  studentGuidedTourPageRouteName() {
    return RouteNames.studentGuidedTourPageRouteName;
  },
  mentorHomePageRouteName() {
    return RouteNames.mentorHomePageRouteName;
  },
  studentHomePageRouteName() {
    return RouteNames.studentHomePageRouteName;
  },
});

Template.Landing_Menubar.events({
  // add your events here
});

Template.Landing_Menubar.onRendered(function landingMenubarOnRendered() {
  // add your statement here
});

Template.Landing_Menubar.onDestroyed(function landingMenubarOnDestroyed() {
  // add your statement here
});


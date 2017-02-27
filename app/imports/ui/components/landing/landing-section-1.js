import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Landing_Section_1.helpers({
  adminHomePageRouteName() {
    return RouteNames.adminHomePageRouteName;
  },
  advisorStudentConfigurationPageRouteName() {
    return RouteNames.advisorStudentConfigurationPageRouteName;
  },
  checkLanding() {
    const routeName = FlowRouter.current().route.name;
    if (routeName === 'Landing_Page') {
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
  useCAS() {
    return false;
  },
});

Template.Landing_Section_1.events({
  // add your events here
});

Template.Landing_Section_1.onCreated(function landingBodyOnCreated() {
  // add your statement here
});

Template.Landing_Section_1.onRendered(function landingBodyOnRendered() {
});

Template.Landing_Section_1.onDestroyed(function landingBodyOnDestroyed() {
  // add your statement here
});


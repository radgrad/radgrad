import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '../../../startup/client/router.js';

Template.Landing_Section_1.helpers({
  adminHomePageRouteName() {
    return RouteNames.adminHomePageRouteName;
  },
  advisorStudentConfigurationPageRouteName() {
    return RouteNames.advisorStudentConfigurationPageRouteName;
  },
  alumniHomePageRouteName() {
    return RouteNames.alumniHomePageRouteName;
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
});

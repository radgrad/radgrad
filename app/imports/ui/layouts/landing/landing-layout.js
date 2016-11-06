import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';


Template.Landing_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Admin', route: RouteNames.adminHomePageRouteName },
      { label: 'Advisor', route: RouteNames.advisorStudentConfigurationPageRouteName },
      { label: 'Faculty', route: RouteNames.facultyHomePageRouteName },
      { label: 'Mentor', route: RouteNames.mentorHomePageRouteName },
      { label: 'Student', route: RouteNames.studentHomePageRouteName },
    ];
  },
  secondMenuLength() {
    return 'five';
  },
});

Template.Landing_Layout.events({
  // add your events here
});

Template.Landing_Layout.onCreated(function landingBodyOnCreated() {
  // add your statement here
});

Template.Landing_Layout.onRendered(function landingBodyOnRendered() {
  // add your statement here
});

Template.Landing_Layout.onDestroyed(function landingBodyOnDestroyed() {
  // add your statement here
});


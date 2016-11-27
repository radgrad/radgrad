import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Advisor_Layout.onCreated(function appBodyOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Advisor_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Student Configuration', route: RouteNames.advisorStudentConfigurationPageRouteName },
      { label: 'Verification Requests', route: RouteNames.advisorVerificationRequestsPendingPageRouteName },
      { label: 'Event Verification', route: RouteNames.advisorEventVerificationPageRouteName },
      { label: 'Completed Verifications', route: RouteNames.advisorCompletedVerificationsPageRouteName },
    ];
  },
  secondMenuLength() {
    return 'four';
  },
  adminSecondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.adminHomePageRouteName },
      { label: 'CRUD', route: RouteNames.adminCrudPageRouteName },
      { label: 'View as Advisor', route: RouteNames.advisorStudentConfigurationPageRouteName },
      { label: 'View as Faculty', route: RouteNames.facultyHomePageRouteName },
      { label: 'View as Student', route: RouteNames.studentHomePageRouteName },
      { label: 'View as Mentor', route: RouteNames.mentorHomePageRouteName },
    ];
  },
  adminSecondMenuLength() {
    return 'six';
  },
});

Template.Advisor_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

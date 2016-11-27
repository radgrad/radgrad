import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';


Template.Mentor_Layout.onCreated(function appBodyOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Mentor_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.mentorHomePageRouteName },
    ];
  },
  secondMenuLength() {
    return 'one';
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

Template.Mentor_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

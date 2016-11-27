import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Student_Layout.onCreated(function appBodyOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Student_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.studentHomePageRouteName },
      { label: 'Degree Planner', route: RouteNames.studentDegreePlannerPageRouteName },
      { label: 'Explorer', route: RouteNames.studentExplorerPageRouteName },
      { label: 'Mentor Space', route: RouteNames.studentMentorSpacePageRouteName },
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

Template.Student_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

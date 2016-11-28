import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { advisorTitle, facultyTitle, studentTitle, mentorTitle } from '../../../api/admin/AdminUtilities';

Template.Admin_Layout.onCreated(function appBodyOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Admin_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.adminHomePageRouteName },
      { label: 'CRUD', route: RouteNames.adminCrudPageRouteName },
      { label: advisorTitle(), route: RouteNames.advisorStudentConfigurationPageRouteName },
      { label: facultyTitle(), route: RouteNames.facultyHomePageRouteName },
      { label: studentTitle(), route: RouteNames.studentHomePageRouteName },
      { label: mentorTitle(), route: RouteNames.mentorHomePageRouteName },
    ];
  },
  secondMenuLength() {
    return 'six';
  },
});

Template.Admin_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

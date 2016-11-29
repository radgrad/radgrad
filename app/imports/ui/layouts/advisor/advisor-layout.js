import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { advisorTitle, facultyTitle, studentTitle, mentorTitle } from '../../../api/admin/AdminUtilities';
import { AdminChoices } from '../../../api/admin/AdminChoiceCollection';
import { Users } from '../../../api/user/UserCollection';

Template.Advisor_Layout.onCreated(function appBodyOnCreated() {
  this.autorun(() => {
    this.subscribe(AdminChoices.getPublicationName());
    this.subscribe(Users.getPublicationName());
  });
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
      { label: advisorTitle(), route: RouteNames.advisorStudentConfigurationPageRouteName },
      { label: facultyTitle(), route: RouteNames.facultyHomePageRouteName },
      { label: studentTitle(), route: RouteNames.studentHomePageRouteName },
      { label: mentorTitle(), route: RouteNames.mentorHomePageRouteName },
    ];
  },
  adminSecondMenuLength() {
    return 'six';
  },
});

Template.Advisor_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

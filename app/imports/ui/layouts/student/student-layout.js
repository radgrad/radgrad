import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { advisorTitle, facultyTitle, studentTitle, mentorTitle } from '../../../api/admin/AdminUtilities';
import { advisorStudentTitle } from '../shared/advisor-utilities';
import { updateSessionState } from '../../../startup/client/session-state';
import { AdminChoices } from '../../../api/admin/AdminChoiceCollection';
import { AdvisorChoices } from '../../../api/advisor/AdvisorChoiceCollection';
import { Users } from '../../../api/user/UserCollection';

Template.Student_Layout.onCreated(function studentLayoutOnCreated() {
  this.autorun(() => {
    this.subscribe(AdminChoices.getPublicationName());
    this.subscribe(AdvisorChoices.getPublicationName());
    this.subscribe(Users.getPublicationName());
  });
});

Template.Student_Layout.onRendered(function studentLayoutOnRendered() {
  updateSessionState();
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
      { label: advisorTitle(), route: RouteNames.advisorStudentConfigurationPageRouteName },
      { label: facultyTitle(), route: RouteNames.facultyHomePageRouteName },
      { label: studentTitle(), route: RouteNames.studentHomePageRouteName },
      { label: mentorTitle(), route: RouteNames.mentorHomePageRouteName },
    ];
  },
  adminSecondMenuLength() {
    return 'six';
  },
  advisorSecondMenuItems() {
    return [
      { label: 'Student Configuration', route: RouteNames.advisorStudentConfigurationPageRouteName },
      { label: 'Verification Requests', route: RouteNames.advisorVerificationRequestsPendingPageRouteName },
      { label: 'Event Verification', route: RouteNames.advisorEventVerificationPageRouteName },
      { label: 'Completed Verifications', route: RouteNames.advisorCompletedVerificationsPageRouteName },
      { label: advisorStudentTitle(), route: RouteNames.studentHomePageRouteName },
    ];
  },
  advisorSecondMenuLength() {
    return 'five';
  },

});

Template.Student_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { advisorTitle, facultyTitle, studentTitle, mentorTitle } from '../../../api/admin/AdminUtilities';
import { updateSessionState } from '../../../startup/client/session-state';
import { AdminChoices } from '../../../api/admin/AdminChoiceCollection';
import { AdvisorChoices } from '../../../api/advisor/AdvisorChoiceCollection';
import { HelpInstances } from '../../../api/help/HelpInstanceCollection';
import { Users } from '../../../api/user/UserCollection';

Template.Admin_Layout.onCreated(function adminLayoutOnCreated() {
  this.autorun(() => {
    this.subscribe(AdminChoices.getPublicationName());
    this.subscribe(AdvisorChoices.getPublicationName());
    this.subscribe(HelpInstances.getPublicationName());
    this.subscribe(Users.getPublicationName());
  });
});

Template.Admin_Layout.onRendered(function adminLayoutOnRendered() {
  updateSessionState();
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

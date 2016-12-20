import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { Users } from '../../../api/user/UserCollection';

Template.Advisor_Layout.onCreated(function appBodyOnCreated() {
  this.subscribe(Users.getPublicationName());
});

Template.Advisor_Layout.onRendered(function advisorLayoutOnRendered() {
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
});

Template.Advisor_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

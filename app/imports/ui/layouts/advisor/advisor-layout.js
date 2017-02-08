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
      {
        label: 'Student Configuration',
        route: RouteNames.advisorStudentConfigurationPageRouteName,
        regex: 'home',
      },
      {
        label: 'Verification Requests',
        route: RouteNames.advisorVerificationRequestsPendingPageRouteName,
        regex: 'verification-requests',
      },
      {
        label: 'Event Verification',
        route: RouteNames.advisorEventVerificationPageRouteName,
        regex: 'event-verification',
      },
      {
        label: 'Completed Verifications',
        route: RouteNames.advisorCompletedVerificationsPageRouteName,
        regex: 'completed-verifications',
      },
      {
        label: 'Review Moderation',
        route: RouteNames.advisorReviewModerationPageRouteName,
        regex: 'advisor-review-moderation',
      },
    ];
  },
  secondMenuLength() {
    return 'five';
  },
});

Template.Advisor_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

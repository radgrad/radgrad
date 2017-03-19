import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

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
        label: 'Moderation',
        route: RouteNames.advisorModerationPageRouteName,
        regex: 'moderation',
      },
    ];
  },
  secondMenuLength() {
    return 'five';
  },
});

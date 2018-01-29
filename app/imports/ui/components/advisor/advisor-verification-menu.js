import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router';

Template.Advisor_Verification_Menu.helpers({
  completedVerificationRouteName() {
    return RouteNames.advisorCompletedVerificationsPageRouteName;
  },
  eventVerificationRouteName() {
    return RouteNames.advisorEventVerificationPageRouteName;
  },
  pendingVerificationRouteName() {
    return RouteNames.advisorVerificationRequestsPendingPageRouteName;
  },
});

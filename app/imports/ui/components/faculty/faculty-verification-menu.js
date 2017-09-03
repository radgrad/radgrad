import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Faculty_Verification_Menu.helpers({
  completedVerificationRouteName() {
    return RouteNames.facultyVerificationPageRouteName;
  },
  pendingAndEventVerificationRouteName() {
    return RouteNames.facultyVerificationCompletedPageRouteName;
  },
});

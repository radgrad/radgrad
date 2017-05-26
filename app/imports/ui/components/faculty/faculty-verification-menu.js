import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';

// /** @module ui/components/faculty/Faculty_Verification_Menu */

Template.Faculty_Verification_Menu.helpers({
  completedVerificationRouteName() {
    return RouteNames.facultyVerificationPageRouteName;
  },
  pendingAndEventVerificationRouteName() {
    return RouteNames.facultyVerificationCompletedPageRouteName;
  },
});

import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';

Template.Faculty_Layout.helpers({
  secondMenuItems() {
    let numRequests = 0;
    numRequests += VerificationRequests.find({ status: 'Open' }).fetch().length;
    let requestsLabel = 'Verification';
    if (numRequests > 0) {
      requestsLabel = `${requestsLabel} (${numRequests})`;
    }
    return [
      { label: 'Home',
        route: RouteNames.facultyHomePageRouteName,
        regex: 'home' },
      { label: 'Manage Opportunities',
        route: RouteNames.facultyManageOpportunitiesPageRouteName,
        regex: 'manage-opportunities' },
      { label: requestsLabel,
        route: RouteNames.facultyVerificationPageRouteName,
        regex: 'verification' },
      { label: 'Explorer',
        route: RouteNames.facultyExplorerPageRouteName,
        regex: 'explorer' },
    ];
  },
  secondMenuLength() {
    return 'four';
  },
});

import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Faculty_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home',
        route: RouteNames.facultyHomePageRouteName,
        regex: 'home' },
      { label: 'Manage Opportunities',
        route: RouteNames.facultyOpportunitiesPageRouteName,
        regex: 'manage-opportunities' },
      { label: 'Verification',
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

import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Faculty_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home',
        route: RouteNames.facultyHomePageRouteName,
        regex: 'home' },
      { label: 'Manage Opportunities',
        route: RouteNames.facultyHomePageRouteName,
        regex: 'manage-opportunities' },
      { label: 'Event Verification',
        route: RouteNames.facultyHomePageRouteName,
        regex: 'event-verification' },
      { label: 'Explorer',
        route: RouteNames.facultyExplorerPageRouteName,
        regex: 'explorer' },
    ];
  },
  secondMenuLength() {
    return 'four';
  },
});

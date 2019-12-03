import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Mentor_Layout.helpers({
  secondMenuItems() {
    return [
      {
        label: 'Home',
        route: RouteNames.mentorHomePageRouteName,
        regex: 'home',
      },
      {
        label: 'Mentor Space',
        route: RouteNames.mentorMentorSpacePageRouteName,
        regex: 'mentor-space',
      },
      {
        label: 'Explorer',
        route: RouteNames.mentorExplorerPageRouteName,
        regex: 'explorer',
      },
    ];
  },
  secondMenuLength() {
    return 'three';
  },
});

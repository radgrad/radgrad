import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Mentor_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home',
        route: RouteNames.mentorHomePageRouteName },
      { label: 'Mentor Space',
        route: RouteNames.mentorExplorerPageRouteName },
      { label: 'Explorer',
        route: RouteNames.mentorExplorerPageRouteName },
    ];
  },
  secondMenuLength() {
    return 'three';
  },
});

import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Faculty_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.facultyHomePageRouteName, regex: 'home' },
    ];
  },
  secondMenuLength() {
    return 'one';
  },
});


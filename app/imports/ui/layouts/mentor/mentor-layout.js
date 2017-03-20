import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Mentor_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.mentorHomePageRouteName },
    ];
  },
  secondMenuLength() {
    return 'one';
  },
});

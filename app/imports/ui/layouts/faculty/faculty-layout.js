import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';


Template.Faculty_Layout.onCreated(function appBodyOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Faculty_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.facultyHomePageRouteName },
    ];
  },
  secondMenuLength() {
    return 'one';
  },
});

Template.Faculty_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

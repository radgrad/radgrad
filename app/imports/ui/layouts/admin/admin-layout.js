import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';


Template.Admin_Layout.onCreated(function appBodyOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Admin_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.adminHomePageRouteName },
      { label: 'View as Student', route: RouteNames.studentHomePageRouteName },
    ];
  },
  secondMenuLength() {
    return 'two';
  },
});

Template.Admin_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

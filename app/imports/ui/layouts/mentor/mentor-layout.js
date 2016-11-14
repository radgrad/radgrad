import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';


Template.Mentor_Layout.onCreated(function appBodyOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

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

Template.Mentor_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

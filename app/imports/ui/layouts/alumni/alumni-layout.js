import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router';

Template.Alumni_Layout.onCreated(function alumniLayoutOnCreated() {
  // add your statement here
});

Template.Alumni_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home',
        route: RouteNames.alumniHomePageRouteName,
        regex: 'home' },
    ];
  },
  secondMenuLength() {
    return 'one';
  },
});

Template.Alumni_Layout.events({
  // add your events here
});

Template.Alumni_Layout.onRendered(function alumniLayoutOnRendered() {
  // add your statement here
});

Template.Alumni_Layout.onDestroyed(function alumniLayoutOnDestroyed() {
  // add your statement here
});


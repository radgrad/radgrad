import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Landing_Section_9.helpers({
  studentGuidedTourPageRouteName() {
    return RouteNames.studentGuidedTourPageRouteName;
  },
});

Template.Landing_Section_9.events({
  // add your events here
});

Template.Landing_Section_9.onCreated(function landingBodyOnCreated() {
  // add your statement here
});

Template.Landing_Section_9.onRendered(function landingBodyOnRendered() {
});

Template.Landing_Section_9.onDestroyed(function landingBodyOnDestroyed() {
  // add your statement here
});


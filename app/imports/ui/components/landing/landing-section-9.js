import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Landing_Section_9.helpers({
  studentGuidedTourPageRouteName() {
    return RouteNames.studentGuidedTourPageRouteName;
  },
  advisorGuidedTourPageRouteName() {
    return RouteNames.advisorGuidedTourPageRouteName;
  },
});

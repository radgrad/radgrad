import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Student_Layout.onCreated(function studentLayoutOnCreated() {
});

Template.Student_Layout.onRendered(function studentLayoutOnRendered() {
});

Template.Student_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.studentHomePageRouteName },
      { label: 'Degree Planner', route: RouteNames.studentDegreePlannerPageRouteName },
      { label: 'Explorer', route: RouteNames.studentExplorerPageRouteName },
      { label: 'Mentor Space', route: RouteNames.studentMentorSpacePageRouteName },
    ];
  },
  secondMenuLength() {
    return 'four';
  },

});

Template.Student_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

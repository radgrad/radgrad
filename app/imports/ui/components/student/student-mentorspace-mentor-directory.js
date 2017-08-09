import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Student_MentorSpace_Mentor_Directory.helpers({
  usersRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
});

Template.Student_MentorSpace_Mentor_Directory.onRendered(function mentorSpaceOnRendered() {
  // this.$('.ui.accordion').accordion('close', 0, { exclusive: false, collapsible: true, active: false });
  this.$('.ui.accordion').accordion();
});

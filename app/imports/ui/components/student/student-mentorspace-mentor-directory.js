import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Student_MentorSpace_Mentor_Directory.helpers({
  // placeholder: if you display dynamic data in your layout, you will put your template helpers here.
  usersRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
});

Template.Student_MentorSpace_Mentor_Directory.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.

});

Template.Student_MentorSpace_Mentor_Directory.onRendered(function mentorSpaceOnRendered() {
  this.$('.ui.accordion').accordion('close', 0, { exclusive: false, collapsible: true, active: false });

  this.$('.ui.dropdown')
      .dropdown()
  ;

  this.$('.ui.rating')
      .rating()
  ;
});

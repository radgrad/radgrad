import { Template } from 'meteor/templating';

Template.Student_MentorSpace_Page.onCreated(function appBodyOnCreated(){
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Student_MentorSpace_Page.helpers({
  // placeholder: if you display dynamic data in your layout, you will put your template helpers here.
});

Template.Student_MentorSpace_Page.events({
 // placeholder: if you add a form to this top-level layout, handle the associated events here.

});

Template.Student_MentorSpace_Page.onRendered(function mentorSpaceOnRendered(){
  $('.ui.accordion').accordion('close', 0, { exclusive: false, collapsible: true, active: false });
});

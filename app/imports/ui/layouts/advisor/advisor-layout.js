import { Template } from 'meteor/templating';

Template.Advisor_Layout.onCreated(function appBodyOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Advisor_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Student Configuration', route: 'Advisor_Student_Configuration_Page' },
      { label: 'Verification Requests', route: 'Advisor_Verification_Requests_Pending_Page' },
      { label: 'Event Verification', route: 'Advisor_Event_Verification_Page' },
      { label: 'Completed Verifications', route: 'Advisor_Completed_Verifications_Page' },
    ];
  },
})
;

Template.Advisor_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

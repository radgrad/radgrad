import { Template } from 'meteor/templating';

Template.Verification_Requests_Pending.onCreated(function appBodyOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Verification_Requests_Pending.helpers({
  // placeholder: if you display dynamic data in your layout, you will put your template helpers here.
});

Template.Verification_Requests_Pending.events({
 // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Verification_Requests_Pending.onRendered(function enableDropDown() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

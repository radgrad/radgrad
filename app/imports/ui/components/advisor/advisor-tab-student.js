import { Template } from 'meteor/templating';

Template.Advisor_Tab_Student.onCreated(function appBodyOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Advisor_Tab_Student.helpers({
  // placeholder: if you display dynamic data in your layout, you will put your template helpers here.
});

Template.Advisor_Tab_Student.events({
 // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Advisor_Tab_Student.onRendered(function enableDropDown() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

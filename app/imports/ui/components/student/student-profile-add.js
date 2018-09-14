import { Template } from 'meteor/templating';

Template.Student_Profile_Add.onCreated(function studentProfileAddOnCreated() {
  // add your statement here
});

Template.Student_Profile_Add.helpers({
  // add your helpers here
});

Template.Student_Profile_Add.events({
  'click .jsAddToProfile': function clickAddToProfile(event, instance) {
    event.preventDefault();
    console.log(event, instance);
  },
});

Template.Student_Profile_Add.onRendered(function studentProfileAddOnRendered() {
  // add your statement here
});

Template.Student_Profile_Add.onDestroyed(function studentProfileAddOnDestroyed() {
  // add your statement here
});


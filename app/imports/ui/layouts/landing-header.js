
import { Template } from 'meteor/templating';

Template.Landing_Header.helpers({
  // add you helpers here
});

Template.Landing_Header.events({
  // add your events here
});

Template.Landing_Header.onCreated(function landingBodyOnCreated() {
  // add your statement here
});

Template.Landing_Header.onRendered(function landingBodyOnRendered() {
  this.$('.dropdown').dropdown();
});

Template.Landing_Header.onDestroyed(function landingBodyOnDestroyed() {
  // add your statement here
});


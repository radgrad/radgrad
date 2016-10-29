import { Template } from 'meteor/templating';

Template.ICE_Badge.helpers({
  i(ice) {
    return ice.i;
  },
  c(ice) {
    return ice.c;
  },
  e(ice) {
    return ice.e;
  },
});

Template.ICE_Badge.events({
  // add your events here
});

Template.ICE_Badge.onCreated(function () {
  // add your statement here
});

Template.ICE_Badge.onRendered(function () {
  // add your statement here
});

Template.ICE_Badge.onDestroyed(function () {
  // add your statement here
});


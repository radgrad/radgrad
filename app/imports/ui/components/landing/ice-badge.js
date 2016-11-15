import { Template } from 'meteor/templating';

Template.ICE_Badge.helpers({
  i(ice) {
    if (ice) {
      return ice.i;
    }
    return null;
  },
  c(ice) {
    if (ice) {
      return ice.c;
    }
    return null;
  },
  e(ice) {
    if (ice) {
      return ice.e;
    }
    return null;
  },
});

Template.ICE_Badge.events({
  // add your events here
});

Template.ICE_Badge.onCreated(function iceBadgeOnCreated() {
  // add your statement here
});

Template.ICE_Badge.onRendered(function iceBadgeOnRendered() {
  // add your statement here
});

Template.ICE_Badge.onDestroyed(function iceBadgeOnDestroyed() {
  // add your statement here
});


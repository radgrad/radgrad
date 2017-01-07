import { Template } from 'meteor/templating';

Template.ICE_Badge_Proj.helpers({
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

Template.ICE_Badge_Proj.events({
  // add your events here
});

Template.ICE_Badge_Proj.onCreated(function iceBadgeOnCreated() {
  // add your statement here
});

Template.ICE_Badge_Proj.onRendered(function iceBadgeOnRendered() {
  // add your statement here
});

Template.ICE_Badge_Proj.onDestroyed(function iceBadgeOnDestroyed() {
  // add your statement here
});

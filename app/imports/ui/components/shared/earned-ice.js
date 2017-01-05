/**
 * Created by Cam Moore on 1/4/17.
 */
import { Template } from 'meteor/templating';

Template.Earned_Ice.helpers({
  pClass(value) {
    return (value <= 100) ? `p${value}` : 'p100';
  },
});

Template.Earned_Ice.events({
  // add your events here
});

Template.Earned_Ice.onCreated(function earnedIceOnCreated() {
  // add your statement here
});

Template.Earned_Ice.onRendered(function earnedIceOnRendered() {
  // add your statement here
});

Template.Earned_Ice.onDestroyed(function earnedIceOnDestroyed() {
  // add your statement here
});


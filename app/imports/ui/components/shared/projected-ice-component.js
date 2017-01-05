/**
 * Created by Cam Moore on 1/4/17.
 */
import { Template } from 'meteor/templating';

Template.Projected_Ice_Component.helpers({
  pClass(value) {
    return (value <= 100) ? `p${value}` : 'p100';
  },
});

Template.Projected_Ice_Component.events({
  // add your events here
});

Template.Projected_Ice_Component.onCreated(function projectedIceOnCreated() {
  // add your statement here
});

Template.Projected_Ice_Component.onRendered(function projectedIceOnRendered() {
  // add your statement here
});

Template.Projected_Ice_Component.onDestroyed(function projectedIceOnDestroyed() {
  // add your statement here
});


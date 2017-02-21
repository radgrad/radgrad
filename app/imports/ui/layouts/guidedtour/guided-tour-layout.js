import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Guided_Tour_Layout.helpers({
  landingPageRouteName() {
    return RouteNames.landingPageRouteName;
  },
});

Template.Guided_Tour_Layout.events({
  // add your events here
});

Template.Guided_Tour_Layout.onCreated(function guidedTourLayoutOnCreated() {
  // add your statement here
});

Template.Guided_Tour_Layout.onRendered(function guidedTourLayoutOnRendered() {
  // add your statement here
  this.$('#carousel').slick({
    dots: true,
    arrows: true,
    infinite: false,
  });
});

Template.Guided_Tour_Layout.onDestroyed(function guidedTourLayoutOnDestroyed() {
  // add your statement here
});

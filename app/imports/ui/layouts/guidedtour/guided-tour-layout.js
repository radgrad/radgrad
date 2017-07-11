import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';

Template.Guided_Tour_Layout.helpers({
  landingPageRouteName() {
    return RouteNames.landingPageRouteName;
  },
});

Template.Guided_Tour_Layout.onCreated(function onCreated() {
  this.subscribe(PublicStats.getPublicationName());
});

Template.Guided_Tour_Layout.onRendered(function onRendered() {
  // add your statement here
  this.$('#carousel').slick({
    dots: true,
    arrows: true,
    infinite: false,
  });
});

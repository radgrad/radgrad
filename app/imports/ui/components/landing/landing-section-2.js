import { Template } from 'meteor/templating';

import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';

Template.Landing_Section_2.helpers({
});

Template.Landing_Section_2.events({
  // add your events here
});

Template.Landing_Section_2.onCreated(function landingBodyOnCreated() {
  this.subscribe(PublicStats.getPublicationName());
});

Template.Landing_Section_2.onRendered(function landingBodyOnRendered() {
});

Template.Landing_Section_2.onDestroyed(function landingBodyOnDestroyed() {
  // add your statement here
});


import { Template } from 'meteor/templating';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';

Template.Landing_Layout.onCreated(function landingBodyOnCreated() {
  this.subscribe(PublicStats.getPublicationName());
});

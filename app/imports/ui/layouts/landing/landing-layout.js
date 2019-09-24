import { Template } from 'meteor/templating';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { Users } from '../../../api/user/UserCollection';

Template.Landing_Layout.onCreated(function landingBodyOnCreated() {
  this.subscribe(PublicStats.getPublicationName());
  this.subscribe(Users.getPublicationName());
});


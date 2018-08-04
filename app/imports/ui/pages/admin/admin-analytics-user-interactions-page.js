import { Template } from 'meteor/templating';
import { UserInteractions } from '../../../api/analytic/UserInteractionCollection';

Template.Admin_Analytics_User_Interactions_Page.onCreated(function onCreated() {
  this.subscribe(UserInteractions.getPublicationName());
});

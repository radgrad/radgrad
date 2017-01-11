import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection';

Template.Admin_Home_Page.onCreated(function onCreated() {
  this.subscribe(Users.getPublicationName());
});

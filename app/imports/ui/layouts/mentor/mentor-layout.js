import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { Users } from '../../../api/user/UserCollection';

Template.Mentor_Layout.onCreated(function mentorLayoutOnCreated() {
  this.subscribe(Users.getPublicationName());
});

Template.Mentor_Layout.onRendered(function mentorLayoutOnRendered() {
});

Template.Mentor_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.mentorHomePageRouteName },
    ];
  },
  secondMenuLength() {
    return 'one';
  },
});

Template.Mentor_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { Users } from '../../../api/user/UserCollection';

Template.Faculty_Layout.onCreated(function facultyLayoutOnCreated() {
  this.subscribe(Users.getPublicationName());
});

Template.Faculty_Layout.onRendered(function facultyLayoutOnRendered() {
});

Template.Faculty_Layout.helpers({
  secondMenuItems() {
    return [
      { label: 'Home', route: RouteNames.facultyHomePageRouteName },
    ];
  },
  secondMenuLength() {
    return 'one';
  },
});

Template.Faculty_Layout.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

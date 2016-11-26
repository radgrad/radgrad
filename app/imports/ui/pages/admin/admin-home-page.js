import { Template } from 'meteor/templating';

import { Users } from '../../../api/user/UserCollection';

Template.Admin_Home_Page.onCreated(function appBodyOnCreated() {
  this.autorun(() => {
    this.subscribe(Users.getPublicationName());
  });
});

Template.Admin_Home_Page.helpers({
  // placeholder: if you display dynamic data in your layout, you will put your template helpers here.
});

Template.Admin_Home_Page.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

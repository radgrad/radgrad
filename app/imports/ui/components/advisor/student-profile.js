import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { lodash } from 'meteor/erasaur:meteor-lodash';

import { ROLE } from '../../../api/role/Role.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Student_Profile.helpers({
});

Template.Student_Profile.events({
  // add your events here
});

Template.Student_Profile.onCreated(function studentProfileOnCreated() {
  this.state = this.data.dictionary;
});

Template.Student_Profile.onRendered(function studentProfileOnRendered() {
  console.log(this.state);
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

Template.Student_Profile.onDestroyed(function studentProfileOnDestroyed() {
  // add your statement here
});


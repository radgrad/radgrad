import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Users } from '../../../api/user/UserCollection';

Template.First_Menu.helpers({
  firstMenuFullName() {
    if (Meteor.userId()) {
      return Users.getFullName(Meteor.userId());
    }
    return '';
  },
  id() {
    return Meteor.userId();
  },
});

// Template.First_Menu.events({
//   'click a.item': function (event) {
//     event.preventDefault();
//     if (Meteor.userId()) {
//       Meteor.logout();
//     }
//   },
// });

Template.First_Menu.onCreated(function firstMenuOnCreated() {
  // add your statement here
});

Template.First_Menu.onRendered(function firstMenuOnRendered() {
  // this.$('a.ui.right.dropdown.item').dropdown({
  //   on: 'hover',
  // });
});

Template.First_Menu.onDestroyed(function firstMenuOnDestroyed() {
  // add your statement here
});


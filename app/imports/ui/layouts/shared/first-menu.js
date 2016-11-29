import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Users } from '../../../api/user/UserCollection';

Template.First_Menu.helpers({
  firstMenuFullName() {
    if (Meteor.userId()) {
      try {
        return Users.getFullName(Meteor.userId());
      } catch (e) {
        // console.log(e, Meteor.userId()); // eslint-disable-line no-console
      }
    }
    return '';
  },
});

Template.First_Menu.events({
  // add events.
});

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


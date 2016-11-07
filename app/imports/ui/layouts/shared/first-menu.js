import { Template } from 'meteor/templating';

Template.First_Menu.helpers({
  // add you helpers here
});

// Template.First_Menu.events({
//   'click a.item'(event) {
//     event.preventDefault();
//     if (Meteor.userId()) {
//       Meteor.logout();
//     }
//   },
// });

Template.First_Menu.onCreated(function () {
  // add your statement here
});

Template.First_Menu.onRendered(function () {
  // this.$('a.ui.right.dropdown.item').dropdown({
  //   on: 'hover',
  // });
});

Template.First_Menu.onDestroyed(function () {
  // add your statement here
});


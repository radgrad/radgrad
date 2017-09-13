import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.User_Status_Widget.onCreated(function userStatusWidgetOnCreated() {
  this.subscribe('userStatus');
});

Template.User_Status_Widget.helpers({
  usersOnline() {
    return Meteor.users.find({ 'status.online': true });
  },
  isIdle(user) {
    console.log(user.status);
    return user.status.idle;
  },
});

Template.User_Status_Widget.events({
  // add your events here
});

Template.User_Status_Widget.onRendered(function userStatusWidgetOnRendered() {
  // add your statement here
});

Template.User_Status_Widget.onDestroyed(function userStatusWidgetOnDestroyed() {
  // add your statement here
});


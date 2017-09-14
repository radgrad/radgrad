import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection';

Template.User_Status_Widget.onCreated(function userStatusWidgetOnCreated() {
  this.subscribe('userStatus');
  this.subscribe(Users.getPublicationName());
});

Template.User_Status_Widget.helpers({
  usersOnline() {
    return Meteor.users.find({ 'status.online': true });
  },
  isIdle(user) {
    // console.log(JSON.stringify(user.status, ' '));
    return user.status.idle;
  },
  label(user) {
    const profile = Users.findProfiles({ username: user.username });
    if (profile && profile[0]) {
      return profile && profile[0] && `${profile[0].lastName}, ${profile[0].firstName}`;
    }
    return 'RadGrad Admin';
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


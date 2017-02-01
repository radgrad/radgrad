import { Template } from 'meteor/templating';

Template.User_Level_Component.helpers({
  level() {
    return 6;
  },
});

Template.User_Level_Component.events({
  // add your events here
});

Template.User_Level_Component.onCreated(function userLevelComponentOnCreated() {
  this.userID = this.data.userID;
});

Template.User_Level_Component.onRendered(function userLevelComponentOnRendered() {
  // add your statement here
});

Template.User_Level_Component.onDestroyed(function userLevelComponentOnDestroyed() {
  // add your statement here
});


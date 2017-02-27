import { Template } from 'meteor/templating';

import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Student_Levels_Widget.helpers({
  achievedLevel(userLevel, level) {
    return userLevel >= level;
  },
  studentLevelName() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      if (user.level) {
        return `LEVEL ${user.level}`;
      }
    }
    return 'LEVEL 1';
  },
  studentLevelNumber() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      if (user.level) {
        return user.level;
      }
    }
    return 1;
  },
});

Template.Student_Levels_Widget.events({});

Template.Student_Levels_Widget.onCreated(function levelStickerLogOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  }
  this.subscribe(Users.getPublicationName());
});

Template.Student_Levels_Widget.onRendered(function levelStickerLogOnRendered() {

});

Template.Student_Levels_Widget.onDestroyed(function levelStickerLogOnDestroyed() {
  // add your statement here
});


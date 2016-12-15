import { Template } from 'meteor/templating';
import { lodash } from 'meteor/erasaur:meteor-lodash';

import { SessionState, sessionKeys } from '../../../startup/client/session-state';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection.js';

Template.Student_Levels.helpers({
  pastLevelsStyle(level) {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      if(level < user.level){
        return 'height:30px; width: auto; border-width: 3px; border-color: green';
        console.log('Less than 4');
      }
      else{
        return 'height:30px; width: auto" class="ui image';
        console.log('More than or equal to 4');
      }
    }
    return '';
  },
  pastLevelsClass(level) {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      if(level < user.level){
        return '"ui bordered image"';
      }
      else{
        return '"ui image"';
      }
    }
    return '';
  },
  studentLevelImageName() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      if (user.level) {
        return `level${user.level}`;
      }
    }
    return 'level1';
  },
  studentLevelName() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      if (user.level) {
        return `Level ${user.level}`;
      }
    }
    return 'Level 1';
  },
  studentLevelNumber() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      if (user.level) {
        return `${user.level}`;
      }
    }
    return '1';
  },
  studentLevelColor() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      switch (user.level) {
        case 1:
          return 'white';
        case 2:
          return 'yellow';
        case 3:
          return 'blue';
        case 4:
          return 'red';
        case 5:
          return 'brown';
        case 6:
          return 'black';
        default:
          return 'white';
      }
    }
    return 'white';
  },
});

Template.Level_Sticker_Log.events({

});

Template.Level_Sticker_Log.onCreated(function levelStickerLogOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  }
});

Template.Level_Sticker_Log.onRendered(function levelStickerLogOnRendered() {

});

Template.Level_Sticker_Log.onDestroyed(function levelStickerLogOnDestroyed() {
  // add your statement here
});


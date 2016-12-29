import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { ROLE } from '../../../api/role/Role.js';

Template.Student_Levels_Others.helpers({
  students(userLevel) {
    if (getUserIdFromRoute()) {
      const students =[];
      _.map(Users.find().fetch(), (user) => {
        if (user.level === userLevel) {
          if (user._id !== getUserIdFromRoute()) {
            students.push(user);
          }
        }
      });
      return students;
    }
    return '';
  },
  pastLevelsStyle(level) {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      if (level < user.level) {
        return 'height:30px; width: auto; border-width: 3px; border-color: green';
      }
      return 'height:30px; width: auto" class="ui image';
    }
    return '';
  },
  pastLevelsClass(level) {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      if (level < user.level) {
        return '"ui bordered image"';
      }
      return '"ui image"';
    }
    return '';
  },
  studentLevelImageName() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      if (user.level) {
        return `level${user.level}`;
      }
    }
    return 'level1';
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
  studentLevelColor() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
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
  studentPicture(student) {
    return `/images/landing/${student.picture}`;
  },
});

Template.Student_Levels_Others.events({});

Template.Student_Levels_Others.onCreated(function levelStickerLogOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  }
  this.subscribe(Users.getPublicationName());
});

Template.Student_Levels_Others.onRendered(function levelStickerLogOnRendered() {

});

Template.Student_Levels_Others.onDestroyed(function levelStickerLogOnDestroyed() {
  // add your statement here
});


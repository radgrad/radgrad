import { Template } from 'meteor/templating';

import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Student_Levels.helpers({
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
        return `Level ${user.level}`;
      }
    }
    return 'Level 1';
  },
  studentLevelNumber() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      if (user.level) {
        return `${user.level}`;
      }
    }
    return '1';
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
});

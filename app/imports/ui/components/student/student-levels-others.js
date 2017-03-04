import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Student_Levels_Others.helpers({
  fullName(student) {
    return Users.getFullName(student._id);
  },
  studentsExist(students) {
    return students.length > 0;
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
  studentPicture(student) {
    return student.picture;
  },
  students(userLevel) {
    const students = [];
    const users = Users.find({ roles: [ROLE.STUDENT] }).fetch();
    _.map(users, (user) => {
      if (user.level === userLevel) {
        if (user._id !== getUserIdFromRoute()) {
          students.push(user);
        }
      }
    });
    return students;
  },
  usersRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
  userUsername(student) {
    return student.username;
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


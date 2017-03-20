import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';

Template.Student_Explorer_Degrees_Widget.helpers({
  fullName(user) {
    return `${Users.findDoc(user).firstName} ${Users.findDoc(user).lastName}`;
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  userPicture(user) {
    if (Users.findDoc(user).picture) {
      return Users.findDoc(user).picture;
    }
    return '/images/default-profile-picture.png';
  },
  usersRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
  userStatus(degree) {
    let ret = true;
    const user = Users.findDoc({ username: getRouteUserName() });
    if (_.includes(user.desiredDegreeID, degree._id)) {
      ret = false;
    }
    return ret;
  },
  userUsername(user) {
    return Users.findDoc(user).username;
  },
});

Template.Student_Explorer_Degrees_Widget.events({
  'click .addItem': function clickAddItem(event) {
    event.preventDefault();
    const student = Users.findDoc({ username: getRouteUserName() });
    const id = event.target.value;
    try {
      Users.setDesiredDegree(student._id, id);
    } catch (e) {
      // don't do anything. // TODO: do something.
    }
  },
  'click .deleteItem': function clickRemoveItem(event) {
    event.preventDefault();
    const student = Users.findDoc({ username: getRouteUserName() });
    try {
      Users.setDesiredDegree(student._id, '');
    } catch (e) {
      // don't do anything.
    }
  },
});

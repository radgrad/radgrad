import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { getGroupName } from '../shared/route-group-name';

Template.Explorer_Choose_User_Widget.onCreated(function explorerChooseUserWidgetOnCreated() {
  if (this.data.userID) {
    this.userID = this.data.userID;
  }
});

Template.Explorer_Choose_User_Widget.helpers({
  advisorRole() {
    return ROLE.ADVISOR;
  },
  alumniRole() {
    return ROLE.ALUMNI;
  },
  facultyRole() {
    return ROLE.FACULTY;
  },
  label(user) {
    const name = `${user.firstName} ${user.lastName}`;
    return name.length > 11 ? `${name.substring(0, 9)}...` : name;
  },
  mentorRole() {
    return ROLE.MENTOR;
  },
  picture(user) {
    if (user.picture) {
      return user.picture;
    }
    return defaultProfilePicture;
  },
  studentRole() {
    return ROLE.STUDENT;
  },
  users(role) {
    return Users.findProfilesWithRole(role, {}, { sort: { lastName: 1 } });
  },
  usersRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
});

Template.Explorer_Choose_User_Widget.events({
  'click .jsRetrieve': function clickJSRetrieve(event, instance) {
    const username = event.target.id;
    const userID = username && Users.getID(username);
    if (userID) {
      instance.userID.set(userID);
    }
  },
});

Template.Explorer_Choose_User_Widget.onRendered(function explorerChooseUserWidgetOnRendered() {
  this.$('.menu .item').tab();
  this.$('.ui.dropdown').dropdown();
});

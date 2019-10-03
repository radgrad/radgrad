import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { ROLE } from '../../../api/role/Role';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import * as RouteNames from '../../../startup/client/router';
import { getRouteUserName } from './route-user-name';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';
import { getGroupName } from './route-group-name';

Template.Card_Explorer_Users_Widget.onCreated(function studentcardexploreruserswidgetOnCreated() {
  // add your statement here
});

Template.Card_Explorer_Users_Widget.helpers({
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
    let users = Users.findProfilesWithRole(role, {}, { sort: { lastName: 1 } });
    if (role === ROLE.STUDENT) {
      users = _.filter(users, (u) => u.optedIn);
    }
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      // const filtered = _.filter(users, (u) => u.username !== profile.username);
      const interestIDs = Users.getInterestIDs(profile.userID);
      // const preferred = new PreferredChoice(filtered, interestIDs);
      const preferred = new PreferredChoice(users, interestIDs);
      return preferred.getOrderedChoices();
    }
    return users;
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

Template.Card_Explorer_Users_Widget.events({
  // add your events here
});

Template.Card_Explorer_Users_Widget.onRendered(function studentcardexploreruserswidgetOnRendered() {
  this.$('.menu .item').tab();
  this.$('.ui.dropdown').dropdown();
});

Template.Card_Explorer_Users_Widget.onDestroyed(function studentcardexploreruserswidgetOnDestroyed() {
  // add your statement here
});


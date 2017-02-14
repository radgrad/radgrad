import { Template } from 'meteor/templating';
import { getRouteUserName } from '../../components/shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import * as RouteNames from '/imports/startup/client/router.js';

Template.First_Menu.onCreated(function onCreated() {
  this.subscribe(Users.getPublicationName());
});

Template.First_Menu.helpers({
  useCAS() {
    return false;
  },
  fullName() {
    const username = getRouteUserName();
    if (username) {
      const user = Users.getUserFromUsername(username);
      return `${user.firstName} ${user.lastName}`;
    }
    return 'Unknown user';
  },
  firstName() {
    const username = getRouteUserName();
    if (username) {
      const user = Users.getUserFromUsername(username);
      return user.firstName;
    }
    return 'Unknown';
  },
  lastName() {
    const username = getRouteUserName();
    if (username) {
      const user = Users.getUserFromUsername(username);
      return user.lastName;
    }
    return 'Unknown';
  },
  pictureSrc() {
    const username = getRouteUserName();
    if (username) {
      const user = Users.getUserFromUsername(username);
      return (user.picture) ? user.picture : '/images/default-profile-picture.png';
    }
    return '/images/default-profile-picture.png';
  },
  levelsRouteName() {
    return RouteNames.studentHomeLevelsPageRouteName;
  },
  iceRouteName() {
    return RouteNames.studentHomeIcePageRouteName;
  },
});

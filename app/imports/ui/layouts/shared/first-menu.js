import { Template } from 'meteor/templating';
import { getRouteUserName } from '../../components/shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import * as RouteNames from '/imports/startup/client/router.js';
import { $ } from 'meteor/jquery';

Template.First_Menu.onCreated(function onCreated() {
  this.subscribe(Users.getPublicationName());
});

Template.First_Menu.helpers({
  firstName() {
    const username = getRouteUserName();
    if (username) {
      const user = Users.getUserFromUsername(username);
      return user.firstName;
    }
    return 'Unknown';
  },
  iceRouteName() {
    return RouteNames.studentHomeIcePageRouteName;
  },
  landingRouteName() {
    return RouteNames.landingPageRouteName;
  },
  lastName() {
    const username = getRouteUserName();
    if (username) {
      const user = Users.getUserFromUsername(username);
      return user.lastName;
    }
    return 'Unknown';
  },
  levelsRouteName() {
    return RouteNames.studentHomeLevelsPageRouteName;
  },
  pictureSrc() {
    const username = getRouteUserName();
    if (username) {
      const user = Users.getUserFromUsername(username);
      return (user.picture) ? user.picture : '/images/default-profile-picture.png';
    }
    return '/images/default-profile-picture.png';
  },
  useCAS() {
    return false;
  },
});

Template.First_Menu.events({
  'click .mobileSidebar': function clickMobileSidebar(event) {
    event.preventDefault();
    $('.ui.sidebar').sidebar('toggle');
  },
});

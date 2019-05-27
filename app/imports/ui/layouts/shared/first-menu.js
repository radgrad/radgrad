import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { getRouteUserName } from '../../components/shared/route-user-name';
import * as RouteNames from '../../../startup/client/router.js';
import { Users } from '../../../api/user/UserCollection';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';

Template.First_Menu.helpers({
  firstName() {
    const username = getRouteUserName();
    if (username) {
      return Users.getProfile(username).firstName;
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
      return Users.getProfile(username).lastName;
    }
    return 'Unknown';
  },
  levelsRouteName() {
    return RouteNames.studentHomeLevelsPageRouteName;
  },
  pictureSrc() {
    const username = getRouteUserName();
    if (username) {
      const profile = Users.getProfile(username);
      return (profile.picture) ? profile.picture : defaultProfilePicture;
    }
    return defaultProfilePicture;
  },
  icePopUpText(planned, earned) {
    return `${earned}/${planned}`;
  },
});

Template.First_Menu.events({
  'click .mobileSidebar': function clickMobileSidebar(event) {
    event.preventDefault();
    $('.ui.sidebar').sidebar('toggle');
  },
});

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import { getRouteUserName } from '../../components/shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';

Template.Mobile_Second_Menu.helpers({
  isCurrentPage: function currentPage(routeName) {
    return FlowRouter.getRouteName() === routeName;
  },
  firstName() {
    const username = getRouteUserName();
    if (username) {
      return Users.getProfile(username).firstName;
    }
    return 'Unknown';
  },
  lastName() {
    const username = getRouteUserName();
    if (username) {
      return Users.getProfile(username).lastName;
    }
    return 'Unknown';
  },
  pictureSrc() {
    const username = getRouteUserName();
    if (username) {
      const profile = Users.getProfile(username);
      return (profile.picture) ? profile.picture : defaultProfilePicture;
    }
    return defaultProfilePicture;
  },
});

Template.Mobile_Second_Menu.events({
  'click a.item': function clickMobileSidebar() {
    $('.ui.sidebar').sidebar('hide');
  },
});


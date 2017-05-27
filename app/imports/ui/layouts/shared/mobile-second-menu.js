import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import { getRouteUserName } from '../../components/shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';

Template.Mobile_Second_Menu.helpers({
  isCurrentPage: function currentPage(routeName) {
    return FlowRouter.getRouteName() === routeName;
  },
  useCase() {
    return false;
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
});

Template.Mobile_Second_Menu.events({
  'click a.item': function clickMobileSidebar() {
    $('.ui.sidebar').sidebar('hide');
  },
});


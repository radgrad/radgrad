import { Template } from 'meteor/templating';
import { getRouteUserName } from '../../components/shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';

Template.First_Menu.onCreated(function onCreated() {
  this.subscribe(Users.getPublicationName());
});

Template.First_Menu.helpers({
  useCAS() {
    return false;
  },
  firstMenuFullName() {
    const username = getRouteUserName();
    if (username) {
      const user = Users.getUserFromUsername(username);
      return `${user.firstName} ${user.lastName}`;
    }
    return 'Unknown user';
  },
  firstMenuPictureSrc() {
    const username = getRouteUserName();
    if (username) {
      const user = Users.getUserFromUsername(username);
      return (user.picture) ? user.picture : '/images/default-profile-picture.png';
    }
    return '/images/default-profile-picture.png';
  },
});

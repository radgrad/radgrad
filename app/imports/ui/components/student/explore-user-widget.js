import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection';
import { ROLE } from '../../../api/role/Role.js';

Template.Explore_User_Widget.helpers({
  email() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      return Users.getEmail(id);
    }
    return '';
  },
  isStudent() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.findDoc(id);
      return user.roles[0] === ROLE.STUDENT;
    }
    return false;
  },
  name() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.findDoc(id);
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  },
  picture() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.findDoc(id);
      if (user.picture) {
        return user.picture;
      }
      return '/images/default-profile-picture.png';
    }
    return '';
  },
  role() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.findDoc(id);
      return user.roles[0];
    }
    return '';
  },
  userID() {
    return Template.instance().userID;
  },
});

Template.Explore_User_Widget.events({
  // add your events here
});

Template.Explore_User_Widget.onCreated(function exploreUserWidgetOnCreated() {
  if (this.data.userID) {
    this.userID = this.data.userID;
  }
});

Template.Explore_User_Widget.onRendered(function exploreUserWidgetOnRendered() {
  // add your statement here
});

Template.Explore_User_Widget.onDestroyed(function exploreUserWidgetOnDestroyed() {
  // add your statement here
});


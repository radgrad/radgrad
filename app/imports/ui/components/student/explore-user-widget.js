import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection';

Template.Explore_User_Widget.helpers({
  name() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      const user = Users.findDoc(id);
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  },
  email() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const id = Template.instance().data.userID.get();
      return Users.getEmail(id);
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


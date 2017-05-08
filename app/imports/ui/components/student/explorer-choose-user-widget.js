import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '/imports/startup/client/router.js';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';

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
    return '/images/default-profile-picture.png';
  },
  studentRole() {
    return ROLE.STUDENT;
  },
  users(role) {
    return Users.find({ roles: [role] }, { sort: { lastName: 1 } });
  },
  usersRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerUsersPageRouteName;
    }
    return RouteNames.facultyExplorerUsersPageRouteName;
  },
});

Template.Explorer_Choose_User_Widget.events({
  'click .jsRetrieve': function clickJSRetrieve(event, instance) {
    const username = event.target.id;
    const user = Users.getUserFromUsername(username);
    if (user) {
      instance.userID.set(user._id);
    }
  },
});

Template.Explorer_Choose_User_Widget.onRendered(function explorerChooseUserWidgetOnRendered() {
  this.$('.menu .item').tab();
  this.$('.ui.dropdown').dropdown();
});

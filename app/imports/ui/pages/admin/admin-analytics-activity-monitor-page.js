import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ROLE } from '../../../api/role/Role.js';
import { UserInteractions } from '../../../api/analytic/UserInteractionCollection';
import { Users } from '../../../api/user/UserCollection';

const roles = [ROLE.STUDENT, ROLE.FACULTY, ROLE.MENTOR];
function userList() {
  const users = {};
  _.each(roles, function (role) {
    users[role] = _.pluck(Users.findProfiles({
      role: role,
    }), 'userID');
  });
  return users;
}

Template.Admin_Analytics_Activity_Monitor_Page.onCreated(function onCreated() {
  this.subscribe(UserInteractions.getPublicationName());
  this.userList = new ReactiveVar(userList());
});

Template.Admin_Analytics_Activity_Monitor_Page.helpers({
  userList() {
    return Template.instance().userList.get();
  },
});


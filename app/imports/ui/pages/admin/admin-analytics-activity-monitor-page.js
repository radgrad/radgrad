import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ReactiveVar } from 'meteor/reactive-var';
import { ROLE } from '../../../api/role/Role.js';
import { Users } from '../../../api/user/UserCollection';

const roles = [ROLE.STUDENT, ROLE.FACULTY, ROLE.MENTOR];
function userList() {
  const users = {};
  _.each(roles, function (role) {
    users[role] = _.map(Users.findProfiles({
      role: role,
    }), 'username');
  });
  return users;
}

Template.Admin_Analytics_Activity_Monitor_Page.onCreated(function onCreated() {
  this.userList = new ReactiveVar(userList());
});

Template.Admin_Analytics_Activity_Monitor_Page.helpers({
  userList() {
    return Template.instance().userList.get();
  },
});

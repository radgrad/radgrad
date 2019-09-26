import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import * as RouteNames from '../../../startup/client/router.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Student_Feed_Modal.helpers({
  fullName(student) {
    if (student.username === '') {
      return 'Anonymous Student';
    }
    return Users.getFullName(student.username);
  },
  userSlug(feed) {
    return Users.getProfile(feed.userIDs[0]).username;
  },
  userRouteName() {
    return RouteNames.studentCardExplorerUsersPageRouteName;
  },
  students(feed) {
    const students = [];
    _.forEach(_.uniq(feed.userIDs), function (userID) {
      students.push(Users.getProfile(userID));
    });
    return students;
  },
});

Template.Student_Feed_Modal.events({
  'click .modal': function clickOpenModal(event, instance) {
    event.preventDefault();
    $(`#${instance.data.feed._id}.ui.small.modal`).modal('show');
  },
});

import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { Users } from '../../../api/user/UserCollection.js';

Template.Student_Feed_Modal.helpers({
  fullName(student) {
    return Users.getFullName(student._id);
  },
  userSlug(feed) {
    return Users.findDoc(feed.userIDs[0]).username;
  },
  userRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
  students(feed) {
    const students = [];
    _.map(feed.userIDs, function (userID) {
      students.push(Users.findDoc(userID));
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

import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';
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
});

Template.Student_Feed_Modal.events({
  'click .modal': function clickOpenModal(event, instance) {
    event.preventDefault();
    $(`#${instance.data.feedID}.ui.small.modal`).modal('show');
  },
});

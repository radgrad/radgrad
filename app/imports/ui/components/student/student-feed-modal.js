import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection.js';
import { Feed } from '../../../api/feed/FeedCollection.js';
import * as RouteNames from '/imports/startup/client/router.js';
import { $ } from 'meteor/jquery';

Template.Student_Feed_Modal.onCreated(function studentFeedModalOnCreated() {
  this.subscribe(Feed.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

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

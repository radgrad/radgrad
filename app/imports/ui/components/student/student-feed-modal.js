import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection.js';
import { Feed } from '../../../api/feed/FeedCollection.js';
import * as RouteNames from '/imports/startup/client/router.js';

Template.Student_Feed_Modal.onCreated(function studentFeedModalOnCreated() {
  this.subscribe(Feed.getPublicationName());
  this.subscribe(Users.getPublicationName());
});


Template.Student_Feed_Modal.onRendered(function studentFeedModalOnRendered() {
  const template = this;
  //template.$('.ui.small.modal').modal('show');
  //template.$('.openModal').modal({ on: 'click', }).modal('show');
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
  'click .openModal': function clickOpenModal(event) {
    event.preventDefault();
    const template = this;
    //template.$('.userModal').modal('show');
    $('.ui.small.modal').modal('show');
  },
});
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Feed } from '../../../api/feed/FeedCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Student_Feed_Widget.onCreated(function studentFeedWidgetOnCreated() {
  this.subscribe(Feed.getPublicationName());
});



Template.Student_Feed_Widget.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  feeds() {
    console.log(Feed.find().fetch());
    return Feed.find().fetch();
  },
  feedStudent(feed) {
    return Users.getFullName(feed.studentID);
  },
  feedDescription(feed) {
    return feed.description;
  },
  feedTimestamp(feed) {
    return feed.timestamp;
  },
});

Template.Student_Feed_Widget.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Student_Feed_Widget.onRendered({
});

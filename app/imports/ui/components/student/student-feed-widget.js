import { Template } from 'meteor/templating';
import { Feed } from '../../../api/feed/FeedCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

function dateDiffInDays(a, b) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((a - b) / MS_PER_DAY);
}

Template.Student_Feed_Widget.onCreated(function studentFeedWidgetOnCreated() {
  this.subscribe(Feed.getPublicationName());
});

Template.Student_Feed_Widget.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  feeds() {
    return Feed.find().fetch();
  },
  feedStudent(feed) {
    return Users.getFullName(feed.studentID);
  },
  feedDescription(feed) {
    var studentFullName = Users.getFullName(feed.studentID);
    var studentAction = feed.description;
    console.log(studentAction);
    var studentAction = studentAction.split(studentFullName)[1];
    console.log(studentAction);
    return studentAction;
  },
  feedTimestamp(feed) {
    let ret = '';
    const feedTime = feed.timestamp;
    const currentTime = Date.now();
    const timeDiff = dateDiffInDays(currentTime, feedTime);
    if (timeDiff === 0) {
      ret = 'Today';
    } else if (timeDiff === 1) {
      ret = 'Yesterday';
    } else {
      ret = `${dateDiffInDays(currentTime, feedTime)} days ago`;
    }
    return ret;
  },
  feedPicture(feed) {
    return feed.picture;
  },
});

Template.Student_Feed_Widget.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

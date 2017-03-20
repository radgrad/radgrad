import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Feeds } from '../../../api/feed/FeedCollection.js';

function dateDiffInDays(a, b) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((a - b) / MS_PER_DAY);
}

Template.Student_Feed_Widget.helpers({
  courseSlug(feed) {
    return Slugs.findDoc(Courses.findDoc(feed.courseID).slugID).name;
  },
  opportunitySlug(feed) {
    return Slugs.findDoc(Opportunities.findDoc(feed.opportunityID).slugID).name;
  },
  userSlug(feed) {
    return Users.findDoc(feed.userIDs[0]).username;
  },
  userRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
  courseRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  opportunityRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  feedDescription(feed) {
    return feed.description;
  },
  feedPicture(feed) {
    return feed.picture;
  },
  feeds() {
    return Feeds.find().fetch();
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
  isType(feed, type) {
    return feed.feedType === type;
  },
  multipleUsers(feed) {
    return feed.userIDs.length > 1;
  },
  students(feed) {
    const students = [];
    _.map(feed.userIDs, function (userID) {
      students.push(Users.findDoc(userID));
    });
    return students;
  },
});

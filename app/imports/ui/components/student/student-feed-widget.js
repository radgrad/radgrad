import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Feeds } from '../../../api/feed/FeedCollection.js';
import { dateDiffInDays } from '../../utilities/template-helpers';

Template.Student_Feed_Widget.helpers({
  courseSlug(feed) {
    return Slugs.findDoc(Courses.findDoc(feed.courseID).slugID).name;
  },
  opportunitySlug(feed) {
    return Slugs.findDoc(Opportunities.findDoc(feed.opportunityID).slugID).name;
  },
  userSlug(feed) {
    return Users.getProfile(feed.userIDs[0]).username;
  },
  userRouteName() {
    return RouteNames.studentCardExplorerUsersPageRouteName;
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
    return Feeds.find({}, { sort: { timestamp: -1 } });
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
    // console.log(feed.description);
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
    _.forEach(feed.userIDs, function (userID) {
      students.push(Users.getProfile(userID));
    });
    return students;
  },
});

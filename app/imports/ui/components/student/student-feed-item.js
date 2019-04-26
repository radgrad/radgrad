import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { dateDiffInDays } from '../../utilities/template-helpers';

Template.Student_Feed_Item.helpers({
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
  picture(feed) {
    // console.log('Student_Feed_Item userIDs = %o', feed.userIDs);
    if (feed.userIDs.length === 0) {
      return feed.picture;
    }
    const profile = Users.getProfile(feed.userIDs[0]);
    if (profile.picture !== '') {
      return profile.picture;
    }
    return '/images/default-profile-picture.png';
  },
});

Template.Student_Feed_Item.onRendered(function studentFeedItemOnRendered() {
  const template = this;
  template.$('.studentList')
      .popup({
        inline: true,
        on: 'click',
      });
});

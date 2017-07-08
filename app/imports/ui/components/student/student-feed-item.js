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
      students.push(Users.findDoc(userID));
    });
    return students;
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

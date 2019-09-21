import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection.js';
import { dateDiffInDays } from '../../utilities/template-helpers';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';

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
  picture(feed) {
    // console.log('Student_Feed_Item userIDs = %o', feed.userIDs);
    if (feed.userIDs.length === 0) {
      return feed.picture;
    }
    const profile = Users.getProfile(feed.userIDs[0]);
    if (profile.picture !== '') {
      return profile.picture;
    }
    return defaultProfilePicture;
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

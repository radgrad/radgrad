import { Template } from 'meteor/templating';

import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection.js';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';

Template.Student_Levels_Widget.helpers({
  achievedLevel(userLevel, level) {
    return userLevel >= level;
  },
  studentLevelName() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      if (user.level) {
        return `LEVEL ${user.level}`;
      }
    }
    return 'LEVEL 1';
  },
  studentLevelNumber() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      if (user.level) {
        return user.level;
      }
    }
    return 1;
  },
  levelFeedback() {
    const feedback = Feedbacks.find({ name: 'Recommendation for next Level' }).fetch();
    let feed = [];
    feed = FeedbackInstances.find({ feedbackID: feedback[0]._id, userID: getUserIdFromRoute() }).fetch();
    if (feed.length === 0) {
      FeedbackFunctions.generateNextLevelRecommendation(getUserIdFromRoute());
      feed = FeedbackInstances.find({ feedbackID: feedback[0]._id, userID: getUserIdFromRoute() }).fetch();
    }
    return feed[0];
  },
});

Template.Student_Levels_Widget.onCreated(function levelStickerLogOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  }
  this.subscribe(Users.getPublicationName());
  this.subscribe(Feedbacks.getPublicationName());
  this.subscribe(FeedbackInstances.getPublicationName());
});

Template.Student_Levels_Widget.onRendered(function levelStickerLogOnRendered() {

});

Template.Student_Levels_Widget.onDestroyed(function levelStickerLogOnDestroyed() {
  // add your statement here
});


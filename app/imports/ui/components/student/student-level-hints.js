import { Template } from 'meteor/templating';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection.js';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_Level_Hints.helpers({
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

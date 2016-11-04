import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection.js';
import { FeedbackType } from '../../../api/feedback/FeedbackType.js';


Template.Recommendations.helpers({
  recommendationArgs(recommendation) {
    return {
      recommendation,
    };
  },
  recommendations() {
    const userId = Meteor.userId();
    const feedback = FeedbackInstances.find({ userID: userId }).fetch();
    const ret = [];
    feedback.forEach((f) => {
      const feed = Feedbacks.find({ _id: f.feedbackID }).fetch();
      if (feed[0].feedbackType === FeedbackType.RECOMMENDATION) {
        ret.push(f);
      }
    });
    return ret;
  },
});

Template.Recommendations.events({
  // add your events here
});

Template.Recommendations.onCreated(function () {
  // add your statement here
});

Template.Recommendations.onRendered(function () {
  // add your statement here
});

Template.Recommendations.onDestroyed(function () {
  // add your statement here
});


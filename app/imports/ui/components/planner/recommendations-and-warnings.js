import { Template } from 'meteor/templating';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection.js';
import { FeedbackType } from '../../../api/feedback/FeedbackType.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Recommendations_And_Warnings.onCreated(function recommendationsAndWarningsOnCreated() {
  // add your statement here
});

Template.Recommendations_And_Warnings.helpers({
  recommendationArgs(recommendation) {
    return {
      recommendation,
    };
  },
  recommendations() {
    const userID = getUserIdFromRoute();
    const feedback = FeedbackInstances.find({ userID }).fetch();
    const ret = [];
    feedback.forEach((f) => {
      const feed = Feedbacks.find({ _id: f.feedbackID }).fetch();
      if (feed[0].feedbackType === FeedbackType.RECOMMENDATION) {
        ret.push(f);
      }
    });
    return ret;
  },
  warningArgs(warning) {
    return {
      warning,
    };
  },
  warnings() {
    const userID = getUserIdFromRoute();
    const feedback = FeedbackInstances.find({ userID }).fetch();
    const ret = [];
    feedback.forEach((f) => {
      const feed = Feedbacks.find({ _id: f.feedbackID }).fetch();
      if (feed[0].feedbackType === FeedbackType.WARNING) {
        ret.push(f);
      }
    });
    return ret;
  },
});

Template.Recommendations_And_Warnings.events({
  // add your events here
});

Template.Recommendations_And_Warnings.onRendered(function recommendationsAndWarningsOnRendered() {
  // add your statement here
});

Template.Recommendations_And_Warnings.onDestroyed(function recommendationsAndWarningsOnDestroyed() {
  // add your statement here
});


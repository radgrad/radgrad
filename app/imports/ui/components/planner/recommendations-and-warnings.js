import { Template } from 'meteor/templating';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Recommendations_And_Warnings.helpers({
  recommendationArgs(recommendation) {
    return {
      recommendation,
    };
  },
  recommendations() {
    const userID = getUserIdFromRoute();
    return FeedbackInstances.findRecommendations(userID);
  },
  warningArgs(warning) {
    return {
      warning,
    };
  },
  warnings() {
    const userID = getUserIdFromRoute();
    return FeedbackInstances.findWarnings(userID);
  },
});

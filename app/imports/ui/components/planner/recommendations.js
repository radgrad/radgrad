
import { Template } from 'meteor/templating';

Template.Recommendations.helpers({
  recommendationArgs(recommendation) {
    return {
      recommendation,
    };
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


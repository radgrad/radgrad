
import { Template } from 'meteor/templating';

Template.Recommendations.helpers({
  recommendationArgs(recommendation) {
    return {
      recommendation,
    };
  },
  recommendations() {
    return [
      { text: 'You need 22 more Innovation points in your plan to get to 100.' },
      { text: 'You need 7 more Competency points in your plan to get to 100.' },
      { text: 'See your ICS advisor to upload STAR data from Fall 2015.' },
    ];
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


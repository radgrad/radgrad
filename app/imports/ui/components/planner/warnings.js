import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection.js';
import { FeedbackType } from '../../../api/feedback/FeedbackType.js';

Template.Warnings.helpers({
  warningArgs(warning) {
    return {
      warning,
    };
  },
  warnings() {
    const userId = Meteor.userId();
    const feedback = FeedbackInstances.find({ userID: userId }).fetch();
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

Template.Warnings.events({
  // add your events here
});

Template.Warnings.onCreated(function () {
  // add your statement here
});

Template.Warnings.onRendered(function () {
  // add your statement here
});

Template.Warnings.onDestroyed(function () {
  // add your statement here
});


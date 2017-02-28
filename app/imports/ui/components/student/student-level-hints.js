import { Template } from 'meteor/templating';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';

Template.Student_Level_Hints.onCreated(function studentLevelHints() {
  this.subscribe(Feedbacks.getPublicationName());
  this.subscribe(FeedbackInstances.getPublicationName());
});

Template.Student_Level_Hints.helpers({
  levelFeedback() {
    const feedback = Feedbacks.find({ name: 'Recommendation for next Level' }).fetch();
    const feed = FeedbackInstances.find({ feedbackID: feedback[0]._id }).fetch();
    return feed[0];
  },
});

import { Template } from 'meteor/templating';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_Level_Hints.helpers({
  levelFeedback() {
    // Of course, this will break if we rename the function!
    const functionName = 'generateNextLevelRecommendation';
    const userID = getUserIdFromRoute();
    const feedbackInstances = FeedbackInstances.find({ userID, functionName }).fetch();
    return (feedbackInstances.length > 0) ? feedbackInstances[0] : 'No hints for next level right now.';
  },
});

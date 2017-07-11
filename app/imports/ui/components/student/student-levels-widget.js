import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';

Template.Student_Levels_Widget.helpers({
  achievedLevel(userLevel, level) {
    return userLevel >= level;
  },
  studentLevelName() {
    if (getUserIdFromRoute()) {
      const profile = Users.getProfile(getUserIdFromRoute());
      if (profile.level) {
        return `LEVEL ${profile.level}`;
      }
    }
    return 'LEVEL 1';
  },
  studentLevelNumber() {
    if (getUserIdFromRoute()) {
      const profile = Users.getProfile(getUserIdFromRoute());
      if (profile.level) {
        return profile.level;
      }
    }
    return 1;
  },
  levelFeedback() {
    // Of course, this will break if we rename the function!
    const functionName = 'generateNextLevelRecommendation';
    const userID = getUserIdFromRoute();
    const feedbackInstances = FeedbackInstances.find({ userID, functionName }).fetch();
    return (feedbackInstances.length > 0) ? feedbackInstances[0] : 'No hints for next level right now.';
  },
});

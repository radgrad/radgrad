import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { getLevelCriteriaStringMarkdown } from '../../../api/level/LevelProcessor';

/* eslint-disable max-len */

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
      return profile.level || 1;
    }
    return 1;
  },
  studentLevelHint() {
    let levelNumber = 0;
    if (getUserIdFromRoute()) {
      const profile = Users.getProfile(getUserIdFromRoute());
      levelNumber = profile.level;
    }
    // The following text is copied from the Help Pane widget. Try to keep the two in sync.
    switch (levelNumber) {
      case 1:
        return getLevelCriteriaStringMarkdown('two');
      case 2:
        return getLevelCriteriaStringMarkdown('three');
      case 3:
        return getLevelCriteriaStringMarkdown('four');
      case 4:
        return getLevelCriteriaStringMarkdown('five');
      case 5:
        return getLevelCriteriaStringMarkdown('six');
      case 6:
        return 'Congratulations!  You have reached the top of the RadGrad mountain!  As a Level 6 RadGrad Ninja, you need not strive any further. There are no further levels to reach.';
      default:
        return 'No level available for this student';
    }
  },
});

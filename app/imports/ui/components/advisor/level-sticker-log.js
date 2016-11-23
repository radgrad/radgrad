import { Template } from 'meteor/templating';
import { lodash } from 'meteor/erasaur:meteor-lodash';

import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { getTotalICE, getPlanningICE } from '../../../api/ice/IceProcessor';

Template.Level_Sticker_Log.helpers({
  earnedICE() {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      const courseInstances = CourseInstances.find({ studentID: user._id, verified: true }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: user._id, verified: true }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      return getTotalICE(earnedInstances);
    }
    return null;
  },
  projectedICE() {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      const courseInstances = CourseInstances.find({ studentID: user._id  }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: user._id }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      const ice = getPlanningICE(earnedInstances);
      if (ice.i > 100) {
        ice.i = 100;
      }
      if (ice.c > 100) {
        ice.c = 100;
      }
      if (ice.e > 100) {
        ice.e = 100;
      }
      return ice;
    }
    return null;
  },
  studentLevelImageName() {
    return 'level3';
  },
  studentLevelName() {
    return 'Level 3';
  },
  studentLevelColor() {
    return 'blue';
  },
});

Template.Level_Sticker_Log.events({
  // add your events here
});

Template.Level_Sticker_Log.onCreated(function levelStickerLogOnCreated() {
  this.state = this.data.dictionary;
});

Template.Level_Sticker_Log.onRendered(function levelStickerLogOnRendered() {
  // add your statement here
});

Template.Level_Sticker_Log.onDestroyed(function levelStickerLogOnDestroyed() {
  // add your statement here
});


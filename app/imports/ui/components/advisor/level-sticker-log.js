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
  stickerEarned(level) {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      return lodash.indexOf(user.stickers, level) !== -1;
    }
    return false;
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
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      if (user.level) {
        return `level${user.level}`;
      }
    }
    return 'level1';
  },
  studentLevelName() {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      if (user.level) {
        return `Level ${user.level}`;
      }
    }
    return 'Level 1';
  },
  studentLevelColor() {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      switch (user.level) {
        case 1:
          return 'white';
        case 2:
          return 'yellow';
        case 3:
          return 'blue';
        case 4:
          return 'red';
        case 5:
          return 'brown';
        case 6:
          return 'black';
        default:
          return 'white';
      }
    }
    return 'white';
  },
});

Template.Level_Sticker_Log.events({
  'click .jsLevelSticker': function clickJsLevelSticker(event, instance) {
    event.preventDefault();
    const uhId = instance.state.get('uhId');
    const student = Users.getUserFromUhId(uhId);
    const levelDivs = event.target.parentElement.getElementsByTagName('a');
    const stickers = [];
    lodash.map(levelDivs, (div) => {
      stickers.push(parseInt(div.attributes[1].nodeValue, 10));
    });
    Users.setStickers(student._id, stickers);
  },
});

Template.Level_Sticker_Log.onCreated(function levelStickerLogOnCreated() {
  this.state = this.data.dictionary;
});

Template.Level_Sticker_Log.onRendered(function levelStickerLogOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

Template.Level_Sticker_Log.onDestroyed(function levelStickerLogOnDestroyed() {
  // add your statement here
});


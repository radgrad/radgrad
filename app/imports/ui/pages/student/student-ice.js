import { Template } from 'meteor/templating';
import { lodash } from 'meteor/erasaur:meteor-lodash';

import { SessionState, sessionKeys } from '../../../startup/client/session-state';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { getTotalICE, getPlanningICE } from '../../../api/ice/IceProcessor';

Template.Student_Ice.helpers({
  firstMenuFullName() {
    if (Meteor.userId()) {
      try {
        return Users.getFullName(Meteor.userId());
      } catch (e) {
        // console.log(e, Meteor.userId()); // eslint-disable-line no-console
      }
    }
    return '';
  },
  earnedICE() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      const courseInstances = CourseInstances.find({ studentID: user._id, verified: true }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: user._id, verified: true }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      return getTotalICE(earnedInstances);
    }
    return null;
  },

  projectedICE() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      const courseInstances = CourseInstances.find({ studentID: user._id }).fetch();
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
});

Template.Student_Ice.events({
  //add events here
});

Template.Student_Ice.onCreated(function studentIceOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  }
});

Template.Student_Ice.onDestroyed(function studentIceOnDestroyed() {
  // add your statement here
});

Template.Student_Ice.onRendered(function enableAccordian() {
  this.$('.accordion').accordion({
    selector: {
      trigger: '.title .icon'
    },
    exclusive: false
  })

});

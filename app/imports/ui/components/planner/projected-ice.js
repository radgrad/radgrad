import { Template } from 'meteor/templating';

import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { getTotalICE, getPlanningICE } from '../../../api/ice/IceProcessor';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Projected_ICE.helpers({
  earnedICE() {
    const studentID = getUserIdFromRoute();
    if (studentID) {
      const user = Users.findDoc(studentID);
      const courseInstances = CourseInstances.find({ studentID: user._id, verified: true }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: user._id, verified: true }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      return getTotalICE(earnedInstances);
    }
    return null;
  },
  projectedICE() {
    const studentID = getUserIdFromRoute();
    if (studentID) {
      const user = Users.findDoc(studentID);
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

Template.Projected_ICE.events({
});

Template.Projected_ICE.onCreated(function projectedICEOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  }
});

Template.Projected_ICE.onRendered(function projectedICEOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

Template.Projected_ICE.onDestroyed(function projectedICEOnDestroyed() {
  // add your statement here
});


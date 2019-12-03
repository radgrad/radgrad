import { Template } from 'meteor/templating';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getEarnedICE, getProjectedICE } from '../../../api/ice/IceProcessor';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_Ice_Widget.helpers({
  earnedICE() {
    if (getUserIdFromRoute()) {
      const profile = Users.getProfile(getUserIdFromRoute());
      const courseInstances = CourseInstances.find({ studentID: profile.userID, verified: true }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: profile.userID, verified: true }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      return getEarnedICE(earnedInstances);
    }
    return null;
  },
  greaterThan100(num) {
    if (num > 100) {
      return 100;
    }
    return num;
  },
  projectedICE() {
    if (getUserIdFromRoute()) {
      const profile = Users.getProfile(getUserIdFromRoute());
      const courseInstances = CourseInstances.find({ studentID: profile.userID }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: profile.userID }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      const ice = getProjectedICE(earnedInstances);
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

Template.Student_Ice_Widget.onRendered(function enableAccordion() {
  this.$('.accordion').accordion({
    selector: {
      trigger: '.title',
    },
    exclusive: false,
  });
});

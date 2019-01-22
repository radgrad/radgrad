import { Template } from 'meteor/templating';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { Users } from '../../../api/user/UserCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { getEarnedICE } from '../../../api/ice/IceProcessor';

Template.Alumni_Ice_Widget.helpers({
  earnedICE() {
    if (getUserIdFromRoute()) {
      const profile = Users.getProfile(getUserIdFromRoute());
      const courseInstances = CourseInstances.find({ studentID: profile.userID, verified: true }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: profile.userID, verified: true }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      // console.log(earnedInstances);
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
});

Template.Alumni_Ice_Widget.onRendered(function alumniIceWidgetOnRendered() {
  this.$('.accordion').accordion({
    selector: {
      trigger: '.title',
    },
    exclusive: false,
  });
});

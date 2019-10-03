import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Users } from '../../../api/user/UserCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Academic_Plan_Viewer_Widget.onCreated(function academicPlanWidgetOnCreated() {
  this.plan = new ReactiveVar('');
});

Template.Academic_Plan_Viewer_Widget.helpers({
  getPlan() {
    if (getUserIdFromRoute()) {
      const studentID = getUserIdFromRoute();
      const profile = Users.getProfile(studentID);
      if (profile.academicPlanID) {
        Template.instance()
          .plan
          .set(AcademicPlans.findDoc(profile.academicPlanID));
      }
    }
    return Template.instance().plan;
  },
});

Template.Academic_Plan_Viewer_Widget.onRendered(function academicPlanWidgetOnRendered() {
  this.$('.dropdown').dropdown({
  });
});

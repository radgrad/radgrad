import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { AcademicPlans } from '../../../api/degree/AcademicPlanCollection';
import { Users } from '../../../api/user/UserCollection';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Academic_Plan_Viewer_Widget.onCreated(function academicPlanWidgetOnCreated() {
  this.plan = new ReactiveVar('');
});

Template.Academic_Plan_Viewer_Widget.helpers({
  getPlan() {
    const studentID = getUserIdFromRoute();
    const user = Users.findDoc(studentID);
    if (user.academicPlanID) {
      Template.instance().plan.set(AcademicPlans.findDoc(user.academicPlanID));
    }
    return Template.instance().plan;
  },
});

Template.Academic_Plan_Viewer_Widget.events({
  // add your events here
});

Template.Academic_Plan_Viewer_Widget.onRendered(function academicPlanWidgetOnRendered() {
  this.$('.dropdown').dropdown({
  });
});

Template.Academic_Plan_Viewer_Widget.onDestroyed(function academicPlanWidgetOnDestroyed() {
  // add your statement here
});


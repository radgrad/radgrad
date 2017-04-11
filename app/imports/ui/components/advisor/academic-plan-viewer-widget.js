import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Academic_Plan_Viewer_Widget.onCreated(function academicPlanWidgetOnCreated() {
  this.plan = new ReactiveVar('');
});

Template.Academic_Plan_Viewer_Widget.helpers({
  getPlan() {
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


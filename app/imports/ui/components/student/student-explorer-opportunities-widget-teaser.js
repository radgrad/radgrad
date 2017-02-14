import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

this.newVideo = new ReactiveVar(FlowRouter.getParam('opportunity'));

Template.Student_Explorer_Opportunities_Widget_Teaser.onRendered(function enableVideo() {
  setTimeout(() => {
    this.$('.ui.embed').embed();
  }, 300);
});

Template.Student_Explorer_Opportunities_Widget_Teaser.helpers({
  teaserUrl(teaser) {
    return teaser.url;
  },
});

Template.Student_Explorer_Opportunities_Widget_Teaser.onCreated(function studentExplorerSocialWidgetOnCreated() {
  //this.currentItem = () => FlowRouter.getParam('opportunity');
});

import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';


Template.Student_Teaser_Widget_Video.onRendered(function enableVideo() {
  setTimeout(() => {
    this.$('.ui.embed').embed('show');
}, 300);
});

Template.Student_Teaser_Widget_Video.onCreated(function studentTeaserWidgetVideo() {

});

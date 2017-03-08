import { Template } from 'meteor/templating';

Template.Student_Teaser_Widget_Video.onRendered(function enableVideo() {
  setTimeout(() => {
    this.$('.ui.embed').embed('show');
  }, 300);
});

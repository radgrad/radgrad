import { Template } from 'meteor/templating';


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

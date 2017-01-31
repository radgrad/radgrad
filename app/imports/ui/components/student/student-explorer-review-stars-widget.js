import { Template } from 'meteor/templating';

Template.Student_Explorer_Review_Stars_Widget.onRendered(function studentExplorerReviewStarsWidget() {
  this.$('.ui.rating').rating('disable');
});

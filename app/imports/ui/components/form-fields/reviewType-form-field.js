import { Template } from 'meteor/templating';

Template.ReviewType_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.ReviewType_Form_Field.helpers({
  isSelected(reviewType, selectedReviewType) {
    return reviewType === selectedReviewType;
  },
});

import { Template } from 'meteor/templating';

Template.FeedbackType_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.FeedbackType_Form_Field.helpers({
  isSelected(feedbackType, selectedFeedbackType) {
    return feedbackType === selectedFeedbackType;
  },
});

import { Template } from 'meteor/templating';

Template.FeedType_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.FeedType_Form_Field.helpers({
  isSelected(feedType, selectedFeedType) {
    return feedType === selectedFeedType;
  },
});

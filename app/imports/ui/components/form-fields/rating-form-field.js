import { Template } from 'meteor/templating';

Template.Rating_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Rating_Form_Field.helpers({
  isSelected(rating, selectedRating) {
    return rating.score === selectedRating;
  },
});

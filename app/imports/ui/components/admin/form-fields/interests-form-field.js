import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

Template.Interests_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Interests_Form_Field.helpers({
  isSelected(interest, selectedInterestIDs) {
    return _.includes(selectedInterestIDs, interest);
  },
});

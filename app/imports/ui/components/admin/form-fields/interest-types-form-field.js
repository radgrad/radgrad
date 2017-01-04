import { Template } from 'meteor/templating';

Template.Interest_Types_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Interest_Types_Form_Field.helpers({
  isSelected(interestType, selectedInterestType) {
    return interestType === selectedInterestType;
  },
});

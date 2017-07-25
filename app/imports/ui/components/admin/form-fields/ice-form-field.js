import { Template } from 'meteor/templating';

Template.ICE_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.ICE_Form_Field.helpers({
  isSelected(value, selectedICE) {
    return value === selectedICE;
  },
});

import { Template } from 'meteor/templating';

Template.Academic_Plan_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Academic_Plan_Form_Field.helpers({
  isSelected(name, selectedName) {
    return name === selectedName;
  },
});

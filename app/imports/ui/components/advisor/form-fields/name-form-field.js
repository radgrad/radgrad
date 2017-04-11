import { Template } from 'meteor/templating';

Template.Name_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Name_Form_Field.helpers({
  isSelected(name, selectedName) {
    return name === selectedName;
  },
});

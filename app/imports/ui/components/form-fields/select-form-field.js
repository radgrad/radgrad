import { Template } from 'meteor/templating';

Template.Select_Form_Field.onCreated(function selectFormFieldOnCreated() {
  // add your statement here
});

Template.Select_Form_Field.helpers({
  isSelected(item, selectedItem) {
    return item === selectedItem;
  },
});

Template.Select_Form_Field.events({
  // add your events here
});

Template.Select_Form_Field.onRendered(function selectFormFieldOnRendered() {
  this.$('.dropdown').dropdown();
});

Template.Select_Form_Field.onDestroyed(function selectFormFieldOnDestroyed() {
  // add your statement here
});


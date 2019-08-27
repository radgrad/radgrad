import { Template } from 'meteor/templating';

Template.Slug_Form_Field.onCreated(function selectFormFieldOnCreated() {
  // add your statement here
});

Template.Slug_Form_Field.helpers({
  isSelected(item, selectedItem) {
    return item === selectedItem;
  },
});

Template.Slug_Form_Field.events({
  // add your events here
});

Template.Slug_Form_Field.onRendered(function selectFormFieldOnRendered() {
  this.$('.dropdown').dropdown();
});

Template.Slug_Form_Field.onDestroyed(function selectFormFieldOnDestroyed() {
  // add your statement here
});


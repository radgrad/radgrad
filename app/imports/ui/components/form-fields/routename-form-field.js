import { Template } from 'meteor/templating';

Template.RouteName_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.RouteName_Form_Field.helpers({
  isSelected(routeName, selectedRouteName) {
    return routeName === selectedRouteName;
  },
});

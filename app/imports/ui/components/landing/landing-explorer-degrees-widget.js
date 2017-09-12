import { Template } from 'meteor/templating';

Template.Landing_Explorer_Degrees_Widget.helpers({
  toUpper(string) {
    return string.toUpperCase();
  },
});

Template.Landing_Explorer_Degrees_Widget.onRendered(function studentExplorerDegressWidget() {
  this.$('.dropdown').dropdown();
});

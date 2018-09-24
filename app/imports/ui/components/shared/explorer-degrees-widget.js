import { Template } from 'meteor/templating';

Template.Explorer_Degrees_Widget.helpers({
  toUpper(string) {
    return string.toUpperCase();
  },
});

Template.Explorer_Degrees_Widget.onRendered(function explorerDegreesWidgetOnRendered() {
  this.$('.dropdown').dropdown();
});

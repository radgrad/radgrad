import { Template } from 'meteor/templating';

// Initialize Semantic UI dropdown menu.
Template.Header.onRendered(function enableDropDown() {
  this.$('.dropdown').dropdown();
});

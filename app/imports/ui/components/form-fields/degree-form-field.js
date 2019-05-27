import { Template } from 'meteor/templating';

Template.Degree_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Degree_Form_Field.helpers({
  isSelected(desiredDegree, selecteddesiredDegree) {
    return desiredDegree === selecteddesiredDegree;
  },
});

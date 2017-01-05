import { Template } from 'meteor/templating';

Template.Desired_Degree_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Desired_Degree_Form_Field.helpers({
  isSelected(desiredDegree, selecteddesiredDegree) {
    return desiredDegree === selecteddesiredDegree;
  },
});

import { Template } from 'meteor/templating';

Template.Year_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Year_Form_Field.helpers({
  isSelected(semesterID, selectedSemesterID) {
    return selectedSemesterID === semesterID;
  },
});

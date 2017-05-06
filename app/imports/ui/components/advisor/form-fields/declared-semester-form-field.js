import { Template } from 'meteor/templating';

Template.Declared_Semester_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Declared_Semester_Form_Field.helpers({
  isSelected(semesterID, selectedSemesterID) {
    return selectedSemesterID === semesterID;
  },
});

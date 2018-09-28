import { Template } from 'meteor/templating';

Template.Semesters_Single_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Semesters_Single_Form_Field.helpers({
  isSelected(semesterID, selectedSemesterID) {
    return selectedSemesterID === semesterID;
  },
});

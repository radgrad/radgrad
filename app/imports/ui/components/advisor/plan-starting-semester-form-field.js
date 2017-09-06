import { Template } from 'meteor/templating';

Template.Plan_Starting_Semester_Form_Field.helpers({
  isSelected(semesterID, selectedSemesterID) {
    return selectedSemesterID === semesterID;
  },
});

Template.Plan_Starting_Semester_Form_Field.onRendered(function planStartingSemesterFormFieldOnRendered() {
  this.$('.dropdown').dropdown();
});

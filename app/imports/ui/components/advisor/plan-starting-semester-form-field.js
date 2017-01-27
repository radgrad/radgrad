import { Template } from 'meteor/templating';

Template.Plan_Starting_Semester_Form_Field.helpers({
  isSelected(semesterID, selectedSemesterID) {
    return selectedSemesterID === semesterID;
  },
});

Template.Plan_Starting_Semester_Form_Field.events({
  // add your events here
});

Template.Plan_Starting_Semester_Form_Field.onCreated(function planStartingSemesterFormFieldOnCreated() {
  // add your statement here
});

Template.Plan_Starting_Semester_Form_Field.onRendered(function planStartingSemesterFormFieldOnRendered() {
  this.$('.dropdown').dropdown();
});

Template.Plan_Starting_Semester_Form_Field.onDestroyed(function planStartingSemesterFormFieldOnDestroyed() {
  // add your statement here
});


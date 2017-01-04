import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

Template.Semesters_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Semesters_Form_Field.helpers({
  isSelected(semesterID, selectedSemesterID) {
    return _.includes(selectedSemesterID, semesterID);
  },
});

import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

Template.Prerequisites_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Prerequisites_Form_Field.helpers({
  isSelected(course, selectedCourseIDs) {
    return _.includes(selectedCourseIDs, course);
  },
});

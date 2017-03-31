import { Template } from 'meteor/templating';

Template.Course_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Course_Form_Field.helpers({
  isSelected(course, selectedCourse) {
    return course === selectedCourse;
  },
  id(course) {
    if (course._id) {
      return course._id;
    }
    return null;
  },
  name(course) {
    if (course.name) {
      return course.shortName;
    }
    return 'NONE';
  },
  number(course) {
    if (course.number) {
      return course.number;
    }
    return 'NONE';
  },
});

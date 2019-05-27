import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection';

Template.Prerequisites_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Prerequisites_Form_Field.helpers({
  isSelected(course, selectedCourseIDs) {
    return _.includes(selectedCourseIDs, course);
  },
  courseSlug(courseID) {
    return Courses.findSlugByID(courseID);
  },
});

import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection';

Template.Landing_Card_Explorer_Courses_Widget.helpers({
  courses() {
    return Courses.findNonRetired({}, { sort: { number: 1 } });
  },
  itemCount() {
    return Courses.findNonRetired({}, { sort: { number: 1 } }).length;
  },
});

import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection';

Template.Landing_Card_Explorer_Courses_Widget.helpers({
  courses() {
    Courses.findNonRetired({}, { sort: { shortName: 1 } });
  },
  itemCount() {
    return Courses.findNonRetired({}, { sort: { shortName: 1 } }).length;
  },
});

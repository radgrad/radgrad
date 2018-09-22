import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection';

Template.Landing_Card_Explorer_Courses_Widget.helpers({
  courses() {
    return Courses.find({}, { sort: { shortName: 1 } }).fetch();
  },
  itemCount() {
    return Courses.find({}, { sort: { shortName: 1 } }).fetch().length;
  },
});

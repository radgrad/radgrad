import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection';

Template.Landing_Card_Explorer_Courses_Page.helpers({
  addedCourses() {
    return Courses.find({}, { sort: { shortName: 1 } }).fetch();
  },
  nonAddedCourses() {
    return [];
  },
});

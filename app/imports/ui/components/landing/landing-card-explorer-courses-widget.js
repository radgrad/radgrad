import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection';

Template.Landing_Card_Explorer_Courses_Widget.helpers({
  courses() {
    const courses = Courses.find({}, { sort: { shortName: 1 } }).fetch();
    return _.filter(courses, (c) => !c.retired);
  },
  itemCount() {
    const courses = Courses.find({}, { sort: { shortName: 1 } }).fetch();
    return _.filter(courses, (c) => !c.retired).length;
  },
});

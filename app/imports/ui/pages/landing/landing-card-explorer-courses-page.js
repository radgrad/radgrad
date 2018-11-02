import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection';

Template.Landing_Card_Explorer_Courses_Page.helpers({
  addedCourses() {
    return _.filter(Courses.find({}, { sort: { shortName: 1 } }).fetch(), (c) => !c.retired);
  },
  nonAddedCourses() {
    return [];
  },
});

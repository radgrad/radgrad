import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection.js';
import { makeCourseICE } from '../../../api/ice/IceProcessor.js';

Template.Add_Course.helpers({
  courseArgs(course) {
    return {
      course,
      ice: makeCourseICE(course, ''),
    };
  },
  courses() {
    return Courses.find().fetch();
  },
});

Template.Add_Course.events({
  // add your events here
});

Template.Add_Course.onCreated(function () {
  // add your statement here
});

Template.Add_Course.onRendered(function () {

});

Template.Add_Course.onDestroyed(function () {
  // add your statement here
});


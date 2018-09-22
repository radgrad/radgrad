import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection';

Template.Landing_Card_Explorer_Courses_Page.onCreated(function landingCardExplorerCoursesPageOnCreated() {
  // add your statement here
});

Template.Landing_Card_Explorer_Courses_Page.helpers({
  addedCourses() {
    return Courses.find({}, { sort: { shortName: 1 } }).fetch();
  },
  nonAddedCourses() {
    return [];
  },
});

Template.Landing_Card_Explorer_Courses_Page.events({
  // add your events here
});

Template.Landing_Card_Explorer_Courses_Page.onRendered(function landingCardExplorerCoursesPageOnRendered() {
  // add your statement here
});

Template.Landing_Card_Explorer_Courses_Page.onDestroyed(function landingCardExplorerCoursesPageOnDestroyed() {
  // add your statement here
});


import { Template } from 'meteor/templating';

Template.Course_Upcoming_Semesters_Widget.helpers({
  semesters() {
    return Template.instance().data.semesters;
  },
  courseName() {
    const course = Template.instance().data.course;
    return course.number;
  },
  course() {
    return Template.instance().data.course;
  },
});

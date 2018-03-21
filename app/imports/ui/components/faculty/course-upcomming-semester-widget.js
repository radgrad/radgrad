import { Template } from 'meteor/templating';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';

Template.Course_Upcomming_Semester_Widget.onCreated(function courseUpcommingSemesterWidgetOnCreated() {
  // add your statement here
});

Template.Course_Upcomming_Semester_Widget.helpers({
  courseCount() {
    const course = Template.instance().course;
    const semester = Template.instance().semester;
    const count = CourseInstances.find({ courseID: course._id, semesterID: semester._id }).count();
    return count;
  },
  hasCount() {
    const course = Template.instance().course;
    const semester = Template.instance().semester;
    return CourseInstances.find({ courseID: course._id, semesterID: semester._id }).count() > 0;
  },
});

Template.Course_Upcomming_Semester_Widget.events({
  // add your events here
});

Template.Course_Upcomming_Semester_Widget.onRendered(function courseUpcommingSemesterWidgetOnRendered() {
  // add your statement here
});

Template.Course_Upcomming_Semester_Widget.onDestroyed(function courseUpcommingSemesterWidgetOnDestroyed() {
  // add your statement here
});


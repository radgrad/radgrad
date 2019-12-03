import { Template } from 'meteor/templating';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';

Template.Course_Upcoming_Semester_Widget.helpers({
  courseCount() {
    const courseID = Template.instance().data.course._id;
    const semesterID = Template.instance().data.semester._id;
    const count = CourseInstances.find({ courseID, semesterID }).count();
    return count;
  },
  hasCount() {
    const { course } = Template.instance().data;
    const { semester } = Template.instance().data;
    return CourseInstances.find({ courseID: course._id, semesterID: semester._id }).count() > 0;
  },
});

import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';

function calcCourseCounts(semesterID) {
  const courses = CourseInstances.find({ note: /4\d\d/, semesterID }).fetch();
  const counts = {};
  _.forEach(courses, (course) => {
    if (counts[course.note]) {
      counts[course.note] += 1;
    } else {
      counts[course.note] = 1;
    }
  });
  return counts;
}

Template.Course_Count_Widget.onCreated(function courseCountWidgetOnCreated() {
  if (this.data) {
    this.semester = this.data;
  }
});

Template.Course_Count_Widget.helpers({
  semesterName() {
    const year = Template.instance().semester.year;
    const term = Template.instance().semester.term;
    return `${term} ${year}`;
  },
  courseInstances4xx() {
    const semesterID = Template.instance().semester._id;
    const counts = calcCourseCounts(semesterID);
    // const year = Template.instance().semester.year;
    // const term = Template.instance().semester.term;
    // console.log(`${term} ${year}`, _.toPairs(counts));
    return _.sortBy(_.toPairs(counts), (c) => c[0]);
  },
  label(count) {
    return `${count[0]} (${count[1]})`;
  },
});

Template.Course_Count_Widget.events({
  // add your events here
});

Template.Course_Count_Widget.onRendered(function courseCountWidgetOnRendered() {
  // add your statement here
});

Template.Course_Count_Widget.onDestroyed(function courseCountWidgetOnDestroyed() {
  // add your statement here
});


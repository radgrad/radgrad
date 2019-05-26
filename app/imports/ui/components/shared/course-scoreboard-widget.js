import { Template } from 'meteor/templating';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseScoreboard } from '../../../startup/client/collections';

Template.Course_Scoreboard_Widget.onCreated(function courseScoreboardWidgetOnCreated() {
  // add your statement here
});

Template.Course_Scoreboard_Widget.helpers({
  courses() {
    return Courses.findNonRetired({ number: { $ne: 'other' } }, { sort: { number: 1 } });
  },
  highlight(course, semester) {
    const id = `${course._id} ${semester._id}`;
    const scoreItem = CourseScoreboard.findOne({ _id: id });
    if (scoreItem) {
      return scoreItem.count > 0;
    }
    return false;
  },
  important(course, semester) {
    const id = `${course._id} ${semester._id}`;
    const scoreItem = CourseScoreboard.findOne({ _id: id });
    if (scoreItem) {
      return scoreItem.count > 10;
    }
    return false;
  },
  semesters() {
    const currentSemester = Semesters.getCurrentSemesterDoc();
    return Semesters.findNonRetired({ semesterNumber: { $gte: currentSemester.semesterNumber } },
      { sort: { semesterNumber: 1 } });
  },
  semesterName(semester) {
    return Semesters.getShortName(semester._id);
  },
  semesterScore(course, semester) {
    const id = `${course._id} ${semester._id}`;
    const scoreItem = CourseScoreboard.findOne({ _id: id });
    if (scoreItem) {
      return scoreItem.count;
    }
    return 0;
  },
});

Template.Course_Scoreboard_Widget.events({
  // add your events here
});

Template.Course_Scoreboard_Widget.onRendered(function courseScoreboardWidgetOnRendered() {
  // add your statement here
});

Template.Course_Scoreboard_Widget.onDestroyed(function courseScoreboardWidgetOnDestroyed() {
  // add your statement here
});


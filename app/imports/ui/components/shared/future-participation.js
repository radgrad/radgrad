import { Template } from 'meteor/templating';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { CourseScoreboard, OpportunityScoreboard } from '../../../startup/client/collections';

Template.Future_Participation.onCreated(function futureParticipationOnCreated() {
  // add your statement here
});

Template.Future_Participation.helpers({
  highlight(course, semester) {
    const id = `${course._id} ${semester._id}`;
    let scoreItem;
    if (this.type === 'courses') {
      scoreItem = CourseScoreboard.findOne({ _id: id });
    } else {
      scoreItem = OpportunityScoreboard.findOne({ _id: id });
    }
    if (scoreItem) {
      return scoreItem.count > 0;
    }
    return false;
  },
  highlightString(course, semester) {
    const id = `${course._id} ${semester._id}`;
    let scoreItem;
    if (this.type === 'courses') {
      scoreItem = CourseScoreboard.findOne({ _id: id });
    } else {
      scoreItem = OpportunityScoreboard.findOne({ _id: id });
    }
    if (scoreItem) {
      if (scoreItem.count > 29) {
        return 'green';
      }
      if (scoreItem.count > 10) {
        return 'yellow';
      }
    }
    return '';
  },
  important(course, semester) {
    const id = `${course._id} ${semester._id}`;
    let scoreItem;
    if (this.type === 'courses') {
      scoreItem = CourseScoreboard.findOne({ _id: id });
    } else {
      scoreItem = OpportunityScoreboard.findOne({ _id: id });
    }
    if (scoreItem) {
      return scoreItem.count > 10;
    }
    return false;
  },
  semesters() {
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const start = currentSemester.semesterNumber;
    const end = start + 9;
    return Semesters.findNonRetired({ semesterNumber: { $gte: start, $lt: end } },
      { sort: { semesterNumber: 1 } });
  },
  semesterName(semester) {
    return Semesters.getShortName(semester._id);
  },
  semesterScore(course, semester) {
    const id = `${course._id} ${semester._id}`;
    let scoreItem;
    if (this.type === 'courses') {
      scoreItem = CourseScoreboard.findOne({ _id: id });
    } else {
      scoreItem = OpportunityScoreboard.findOne({ _id: id });
    }
    if (scoreItem) {
      return scoreItem.count;
    }
    return 0;
  },
});

Template.Future_Participation.events({
  // add your events here
});

Template.Future_Participation.onRendered(function futureParticipationOnRendered() {
  // add your statement here
});

Template.Future_Participation.onDestroyed(function futureParticipationOnDestroyed() {
  // add your statement here
});


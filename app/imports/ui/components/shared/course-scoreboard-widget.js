import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { moment } from 'meteor/momentjs:moment';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ZipZap } from 'meteor/udondan:zipzap';

import { Semesters } from '../../../api/semester/SemesterCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseScoreboard } from '../../../startup/client/collections';
import './course-scoreboard-widget.css';

Template.Course_Scoreboard_Widget.onCreated(function courseScoreboardWidgetOnCreated() {
  this.saveWorking = new ReactiveVar();
  this.results = new ReactiveVar();
  this.successOrError = new ReactiveVar();
});

Template.Course_Scoreboard_Widget.helpers({
  courses() {
    return Courses.findNonRetired({ number: { $ne: 'other' } }, { sort: { number: 1 } });
  },
  errorMessage() {
    return Template.instance()
      .successOrError
      .get() === 'error' ? Template.instance()
      .results
      .get() : '';
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
  hidden() {
    const data = Template.instance()
      .results
      .get();
    return (data) ? '' : 'hidden';
  },
  results() {
    return Template.instance()
      .results
      .get() || '';
  },
  successOrError() {
    return Template.instance()
      .successOrError
      .get();
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
    const scoreItem = CourseScoreboard.findOne({ _id: id });
    if (scoreItem) {
      return scoreItem.count;
    }
    return 0;
  },
  saveWorking() {
    return Template.instance()
      .saveWorking
      .get();
  },
});

// Must match the format in the server-side startup/server/fixtures.js
export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

Template.Course_Scoreboard_Widget.events({
  'click .jsSaveCSV': function clickSaveCSV(event, instance) {
    event.preventDefault();
    instance.saveWorking.set(true);
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const start = currentSemester.semesterNumber;
    const end = start + 9;
    const semesters = Semesters.findNonRetired({ semesterNumber: { $gte: start, $lt: end } },
      { sort: { semesterNumber: 1 } });
    const courses = Courses.findNonRetired({ number: { $ne: 'other' } }, { sort: { number: 1 } });
    let result = '';
    const headerArr = ['Course'];
    _.forEach(semesters, (s) => {
      headerArr.push(Semesters.getShortName(s._id));
    });
    result += headerArr.join(',');
    result += '\r\n';
    _.forEach(courses, (c) => {
      result += `${c.number},`;
      _.forEach(semesters, (s) => {
        const id = `${c._id} ${s._id}`;
        const scoreItem = CourseScoreboard.findOne({ _id: id });
        result += scoreItem ? `${scoreItem.count},` : '0,';
      });
      result += '\r\n';
    });
    console.log(result);
    instance.results.set(result);
    instance.successOrError.set('success');
    const zip = new ZipZap();
    const dir = 'course-scoreboard';
    const fileName = `${dir}/${moment().format(databaseFileDateFormat)}.csv`;
    zip.file(fileName, result);
    zip.saveAs(`${dir}.zip`);
    instance.saveWorking.set(false);
  },
});

Template.Course_Scoreboard_Widget.onRendered(function courseScoreboardWidgetOnRendered() {

});

Template.Course_Scoreboard_Widget.onDestroyed(function courseScoreboardWidgetOnDestroyed() {
  // add your statement here
});


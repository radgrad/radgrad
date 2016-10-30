import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { lodash } from 'meteor/erasaur:meteor-lodash';

const studentSemesters = () => {
  const user = Users.find({ username: Template.instance().state.get('studentUsername') }).fetch();
  const courseInstances = CourseInstances.find({ studentID: user[0]._id }).fetch();
  const ids = [];
  courseInstances.forEach((ci) => {
    if (lodash.indexOf(ids, ci.semesterID) === -1) {
      ids.push(ci.semesterID);
    }
  });
  const ret = [];
  ids.forEach((id) => {
    ret.push(Semesters.findDoc(id));
  });
  return lodash.orderBy(ret, ['sortBy'], ['asc']);
};

const academicYears = () => {
  const ret = {};
  const semesters = studentSemesters();
  semesters.forEach((semester) => {
    let year = 0;
    if (semester.term === Semesters.FALL) {
      year = semester.year;
    } else {
      year = semester.year - 1;
    }
    if (!ret[year]) {
      ret[year] = { year };
    }
    if (!ret[year].semesters) {
      ret[year].semesters = {};
    }
    ret[year].semesters[semester.term] = semester;
  });
  return ret;
};

Template.Academic_Plan.helpers({
  args(ay) {
    return {
      year: ay,
      currentSemester: Semesters.findDoc(Semesters.getCurrentSemester()),
    };
  },
  years() {
    const years = academicYears();
    const ret = [];
    for (const key in years) {  /* eslint no-restricted-syntax: "off" */
      ret.push(years[key]);
    }
    return ret;
  },
});

Template.Academic_Plan.events({
  // add your events here
});

Template.Academic_Plan.onCreated(function academicPlanOnCreated() {
  this.state = new ReactiveDict();
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Academic_Plan.onRendered(function academicPlanOnRendered() {
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Academic_Plan.onDestroyed(function academicPlanOnDestroyed() {
  // add your statement here
});


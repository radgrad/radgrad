import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
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

Template.Academic_Plan_2.helpers({
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
  fallArgs(year) {
    if (Template.instance().state.get('currentSemesterID')) {
      const currentSemesterID = Template.instance().state.get('currentSemesterID');
      const currentSemester = Semesters.findDoc(currentSemesterID);
      const semesterID = Semesters.define({
        year: year.year,
        term: Semesters.FALL,
      });
      const semester = Semesters.findDoc(semesterID);
      return { currentSemester, semester };
    }
    return null;
  },
  springArgs(year) {
    if (Template.instance().state.get('currentSemesterID')) {
      const currentSemesterID = Template.instance().state.get('currentSemesterID');
      const currentSemester = Semesters.findDoc(currentSemesterID);
      const semesterID = Semesters.define({
        year: year.year + 1,
        term: Semesters.SPRING,
      });
      const semester = Semesters.findDoc(semesterID);
      return { currentSemester, semester };
    }
    return null;
  },
  summerArgs(year) {
    if (Template.instance().state.get('currentSemesterID')) {
      const currentSemesterID = Template.instance().state.get('currentSemesterID');
      const currentSemester = Semesters.findDoc(currentSemesterID);
      const semesterID = Semesters.define({
        year: year.year + 1,
        term: Semesters.SUMMER,
      });
      const semester = Semesters.findDoc(semesterID);
      return { currentSemester, semester };
    }
    return null;
  },
});

Template.Academic_Plan_2.events({
  'click .item.del'(event) {
    event.preventDefault();
    const template = Template.instance();
    template.$('a.item.400').popup('hide all');
    const id = event.target.id;
    const split = id.split('-');
    if (split.length === 2) {
      const ci = CourseInstances.find({ note: split[1], studentID: Meteor.userId() }).fetch();
      if (ci.length === 1) {
        template.state.set('working', true);
        CourseInstances.removeIt(ci[0]);
      }
      Tracker.afterFlush(() => {
        template.state.set('working', false);
      });
    }
  },
});

Template.Academic_Plan_2.onCreated(function academicPlan2OnCreated() {
  this.state = new ReactiveDict();
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Academic_Plan_2.onRendered(function academicPlan2OnRendered() {
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Academic_Plan_2.onDestroyed(function academicPlan2OnDestroyed() {
  // add your statement here
});


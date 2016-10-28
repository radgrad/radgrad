import { Template } from 'meteor/templating';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { lodash } from 'meteor/erasaur:meteor-lodash';

const studentSemesters = (courseInstances) => {
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
  return lodash.orderBy(ret, ['year', 'term'], ['asc', 'asc']);
};

const semesterInPast = (semester1, semester2) => {
  if (semester1.year < semester2.year) {
    return true;
  } else if (semester1.year === semester2.year) {
    if (semester2.term === 'Fall' && semester1.term !== 'Fall') {
      return true;
    }
    if (semester2.term === 'Summer' && semester1.term === 'Spring') {
      return true;
    }
  }
  return false;
};

Template.Past_Semesters.helpers({
  semesterArg(semesterID) {
    return {
      semesterID,
      studentUsername: Template.instance().state.get('studentUsername'),
    };
  },
  pastSemesters() {
    let ret = [];
    const currentSemester = Semesters.findDoc(Template.instance().state.get('currentSemesterID'));
    const user = Users.find({ username: Template.instance().state.get('studentUsername') }).fetch();
    const courseInstances = CourseInstances.find({ studentID: user[0]._id }).fetch();
    // console.log(courseInstances[0]);
    const semesters = studentSemesters(courseInstances);
    ret = lodash.filter(semesters, function (s) {
      return semesterInPast(s, currentSemester);
    });
    return ret;
  },
});

Template.Past_Semesters.events({
  // add your events here
});

Template.Past_Semesters.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Past_Semesters.onRendered(function () {
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Past_Semesters.onDestroyed(function () {
  // add your statement here
});


import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
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

const semesterInFuture = (semester1, semester2) => {
  if (semester1.year > semester2.year) {
    return true;
  } else if (semester1.year === semester2.year) {
    if (semester1.term === semester2.term) {
      return true;
    }
    if (semester1.term === 'Fall') {
      return true;
    }
    if (semester1.term === 'Spring' && semester2.term === 'Summer') {
      return false;
    }
  }
  return false;
};

Template.Future_Semesters.helpers({
  semesterArg(semesterID) {
    return {
      semesterID,
      studentUsername: Template.instance().state.get('studentUsername'),
    };
  },
  futureSemesters() {
    let ret = [];
    const currentSemester = Semesters.findDoc(Template.instance().state.get('currentSemesterID'));
    const user = Users.find({ username: Template.instance().state.get('studentUsername') }).fetch();
    const courseInstances = CourseInstances.find({ studentID: user[0]._id }).fetch();
    // console.log(courseInstances);
    const semesters = studentSemesters(courseInstances);
    ret = lodash.filter(semesters, function (s) {
      return semesterInFuture(s, currentSemester);
    });
    return ret;
  },
});

Template.Future_Semesters.events({
  'click .inspect'(event, instance) {
    event.preventDefault();
    console.log('click item inspect');
    console.log(instance);
  },
});

Template.Future_Semesters.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Future_Semesters.onRendered(function () {
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Future_Semesters.onDestroyed(function () {
  // add your statement here
});


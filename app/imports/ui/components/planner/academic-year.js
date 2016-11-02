import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

const fallIcsCourses = () => {
  const ret = [];
  if (Template.instance().state.get('year').semesters[Semesters.FALL]) {
    const user = Users.find({ username: Meteor.user().username }).fetch();
    const courses = CourseInstances.find({
      semesterID: Template.instance().state.get('year').semesters[Semesters.FALL]._id,
      studentID: user[0]._id,
    }).fetch();
    courses.forEach((c) => {
      if (CourseInstances.isICS(c._id)) {
        ret.push(c);
      }
    });
  }
  return ret;
};

const fallNonIcsCourses = () => {
  const ret = [];
  if (Template.instance().state.get('year').semesters[Semesters.FALL]) {
    const user = Users.find({ username: Meteor.user().username }).fetch();
    const courses = CourseInstances.find({
      semesterID: Template.instance().state.get('year').semesters[Semesters.FALL]._id,
      studentID: user[0]._id,
    }).fetch();
    courses.forEach((c) => {
      if (!CourseInstances.isICS(c._id)) {
        ret.push(c);
      }
    });
  }
  return ret;
};

const springIcsCourses = () => {
  const ret = [];
  if (Template.instance().state.get('year').semesters[Semesters.SPRING]) {
    const user = Users.find({ username: Meteor.user().username }).fetch();
    const courses = CourseInstances.find({
      semesterID: Template.instance().state.get('year').semesters[Semesters.SPRING]._id,
      studentID: user[0]._id,
    }).fetch();
    courses.forEach((c) => {
      if (CourseInstances.isICS(c._id)) {
        ret.push(c);
      }
    });
  }
  return ret;
};

const springNonIcsCourses = () => {
  const ret = [];
  if (Template.instance().state.get('year').semesters[Semesters.SPRING]) {
    const user = Users.find({ username: Meteor.user().username }).fetch();
    const courses = CourseInstances.find({
      semesterID: Template.instance().state.get('year').semesters[Semesters.SPRING]._id,
      studentID: user[0]._id,
    }).fetch();
    courses.forEach((c) => {
      if (!CourseInstances.isICS(c._id)) {
        ret.push(c);
      }
    });
  }
  return ret;
};

const summerIcsCourses = () => {
  const ret = [];
  if (Template.instance().state.get('year').semesters[Semesters.SUMMER]) {
    const user = Users.find({ username: Meteor.user().username }).fetch();
    const courses = CourseInstances.find({
      semesterID: Template.instance().state.get('year').semesters[Semesters.SUMMER]._id,
      studentID: user[0]._id,
    }).fetch();
    courses.forEach((c) => {
      if (CourseInstances.isICS(c._id)) {
        ret.push(c);
      }
    });
  }
  return ret;
};

const summerNonIcsCourses = () => {
  const ret = [];
  if (Template.instance().state.get('year').semesters[Semesters.SUMMER]) {
    const user = Users.find({ username: Meteor.user().username }).fetch();
    const courses = CourseInstances.find({
      semesterID: Template.instance().state.get('year').semesters[Semesters.SUMMER]._id,
      studentID: user[0]._id,
    }).fetch();
    courses.forEach((c) => {
      if (!CourseInstances.isICS(c._id)) {
        ret.push(c);
      }
    });
  }
  return ret;
};

Template.Academic_Year.helpers({
  fallIcsCourses() {
    return fallIcsCourses();
  },
  springIcsCourses() {
    return springIcsCourses();
  },
  summerIcsCourses() {
    return summerIcsCourses();
  },
  fallNonIcsCourses() {
    return fallNonIcsCourses();
  },
  springNonIcsCourses() {
    return springNonIcsCourses();
  },
  summerNonIcsCourses() {
    return summerNonIcsCourses();
  },
  fallArgs() {
    if (Template.instance().state.get('currentSemester') && Template.instance().state.get('year')) {
      const currentSemester = Template.instance().state.get('currentSemester');
      const semesterID = Semesters.define({
        year: Template.instance().state.get('year').year,
        term: Semesters.FALL,
      });
      const semester = Semesters.findDoc(semesterID);
      return { currentSemester, semester };
    }
    return null;
  },
  springArgs() {
    if (Template.instance().state.get('currentSemester') && Template.instance().state.get('year')) {
      const currentSemester = Template.instance().state.get('currentSemester');
      const semesterID = Semesters.define({
        year: Template.instance().state.get('year').year + 1,
        term: Semesters.SPRING,
      });
      const semester = Semesters.findDoc(semesterID);
      return { currentSemester, semester };
    }
    return null;
  },
  summerArgs() {
    try {
      if (Template.instance().state.get('currentSemester') && Template.instance().state.get('year')) {
        const currentSemester = Template.instance().state.get('currentSemester');
        const semesterID = Semesters.define({
          year: Template.instance().state.get('year').year + 1,
          term: Semesters.SUMMER,
        });
        const semester = Semesters.findDoc(semesterID);
        return { currentSemester, semester };
      }
    } catch (e) {
      console.log(e);
      console.log(`${Template.instance().state.get('year').year} SUMMER`);
    }
    return null;
  },
  fallPaddingRows() {
    const len = 7 - fallIcsCourses().length - fallNonIcsCourses().length;
    const ret = new Array(len);
    for (let i = 0; i < len; i++) {
      ret[i] = ' ';
    }
    console.log(ret);
    return ret;
  },
});

Template.Academic_Year.events({});

Template.Academic_Year.onCreated(function academicYearOnCreated() {
  this.state = new ReactiveDict();
  this.state.set('year', this.data.year);
  this.state.set('currentSemester', this.data.currentSemester);
});

Template.Academic_Year.onRendered(function academicYearOnRendered() {
  // console.log(this.data);
  this.state.set('year', this.data.year);
  this.state.set('currentSemester', this.data.currentSemester);
});

Template.Academic_Year.onDestroyed(function academicYearOnDestroyed() {
  // add your statement here
});

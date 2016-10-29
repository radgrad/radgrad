import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Academic_Year.helpers({
  fallIcsCourses() {
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
  },
  springIcsCourses() {
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
  },
  summerIcsCourses() {
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
  },
  fallNonIcsCourses() {
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
  },
  springNonIcsCourses() {
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
  },
  summerNonIcsCourses() {
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
  },
});

Template.Academic_Year.events({
});

Template.Academic_Year.onCreated(function academicYearOnCreated() {
  this.state = new ReactiveDict();
  this.state.set('year', this.data.year);
});

Template.Academic_Year.onRendered(function academicYearOnRendered() {
});

Template.Academic_Year.onDestroyed(function academicYearOnDestroyed() {
  // add your statement here
});

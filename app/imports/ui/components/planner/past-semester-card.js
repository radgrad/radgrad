import { Template } from 'meteor/templating';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Past_Semester_Card.helpers({
  title() {
    return Semesters.toString(Template.instance().data.semesterID);
  },
  icsCourses() {
    const ret = [];
    const user = Users.find({ username: Template.instance().data.studentUsername }).fetch();
    const courses = CourseInstances.find({
      semesterID: Template.instance().data.semesterID,
      studentID: user[0]._id }).fetch();
    courses.forEach((c) => {
      if (CourseInstances.isICS(c._id)) {
        ret.push(c);
      }
    });
    return ret;
  },
  nonIcsCourses() {
    const ret = [];
    const user = Users.find({ username: Template.instance().data.studentUsername }).fetch();
    const courses = CourseInstances.find({
      semesterID: Template.instance().data.semesterID,
      studentID: user[0]._id }).fetch();
    courses.forEach((c) => {
      if (!CourseInstances.isICS(c._id)) {
        ret.push(c);
      }
    });
    return ret;
  },
  opporunities() {

  },
  semesterCredits() {
    const user = Users.find({ username: Template.instance().data.studentUsername }).fetch();
    const courses = CourseInstances.find({
      semesterID: Template.instance().data.semesterID,
      studentID: user[0]._id }).fetch();
    let credits = 0;
    courses.forEach((c) => {
      if (c.grade && c.grade !== 'F') {
        credits += c.creditHrs;
      }
    });
    return credits;
  },
});

Template.Past_Semester_Card.events({
  // add your events here
});

Template.Past_Semester_Card.onCreated(function () {
  // add your statement here
});

Template.Past_Semester_Card.onRendered(function () {
  // console.log(this.data);
});

Template.Past_Semester_Card.onDestroyed(function () {
  // add your statement here
});


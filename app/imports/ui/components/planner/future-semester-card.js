import { Template } from 'meteor/templating';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Future_Semester_Card.helpers({
  title() {
    return Semesters.toString(Template.instance().data.semesterID);
  },
  icsCourses() {
    const ret = [];
    const user = Users.find({ username: Template.instance().data.studentUsername }).fetch();
    const courses = CourseInstances.find({
      semesterID: Template.instance().data.semesterID,
      studentID: user[0]._id
    }).fetch();
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
      studentID: user[0]._id
    }).fetch();
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
      studentID: user[0]._id
    }).fetch();
    let credits = 0;
    courses.forEach((c) => {
      credits += c.creditHrs;
    });
    return credits;
  },
});

Template.Future_Semester_Card.events({
  // 'click .inspect'(event, instance) {
  //   event.preventDefault();
  //   console.log('card click item inspect');
  //   console.log(instance);
  // },
});

Template.Future_Semester_Card.onCreated(function () {
  //add your statement here
});

Template.Future_Semester_Card.onRendered(function () {
  this.$('.courseInstance').popup({
    inline: true, hoverable: true, position: 'right center',
    delay: { show: 300, hide: 800 }
  });
  this.$('.ui.icon.button').popup({ on: 'click', target: '.ui.icon.button' });
});

Template.Future_Semester_Card.onDestroyed(function () {
  //add your statement here
});


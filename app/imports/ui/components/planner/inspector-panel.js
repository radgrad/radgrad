import { Template } from 'meteor/templating';
import { lodash } from 'meteor/erasaur:meteor-lodash';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Courses } from '../../../api/course/CourseCollection.js';
// import { makeCourseICE } from '../../../api/ice/IceProcessor.js';
// import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Inspector_Panel.helpers({
  courses() {
    let ret = [];
    const courses = Courses.find().fetch();
    const user = Users.find({ username: Template.instance().state.get('studentUsername') }).fetch();
    if (user.length > 0) {
      const instances = CourseInstances.find({ studentID: user[0]._id }).fetch();
      const courseTakenIDs = [];
      instances.forEach((courseInstance) => {
        if (CourseInstances.isICS(courseInstance._id)) {
          courseTakenIDs.push(courseInstance.courseID);
        }
      });
      ret = lodash.filter(courses, function (c) {
        if (c.number === 'other') {
          return false;
        }
        return lodash.indexOf(courseTakenIDs, c._id) === -1;
      });
    }
    return ret;
  },
  detailCourseNumber() {
    const course = Courses.find({ _id: Template.instance().state.get('detailCourseID') }).fetch();
    return course[0];
  },
  hasCourse() {
    return Template.instance().state.get('detailCourseID');
  },
  courseNumber() {
    if (Template.instance().state.get('detailCourseID')) {
      const courseId = Template.instance().state.get('detailCourseID');
      const course = Courses.findDoc({ _id: courseId });
      return course.number;
    }
    return null;
  },
  courseName() {
    if (Template.instance().state.get('detailCourseID')) {
      const courseId = Template.instance().state.get('detailCourseID');
      const course = Courses.findDoc({ _id: courseId });
      return course.name;
    }
    return null;
  },
  courseIce() {
    if (Template.instance().state.get('detailCourseID')) {
      const courseId = Template.instance().state.get('detailCourseID');
      const course = Courses.findDoc({ _id: courseId });
      return course.ice;
    }
    return null;
  },
  courseDescription() {
    if (Template.instance().state.get('detailCourseID')) {
      const courseId = Template.instance().state.get('detailCourseID');
      const course = Courses.findDoc({ _id: courseId });
      return course.description;
    }
    return null;
  },
});

Template.Inspector_Panel.events({
  'click .item'(event) {
    event.preventDefault();
    const courseArr = Courses.find({ number: event.target.id }).fetch();
    if (courseArr.length > 0) {
      Template.instance().state.set('detailCourseID', courseArr[0]._id);
    }
  },
});

Template.Inspector_Panel.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Inspector_Panel.onRendered(function () {
  this.state.set('currentSemesterID', this.data.currentSemesterID);
  this.state.set('studentUsername', this.data.studentUserName);
});

Template.Inspector_Panel.onDestroyed(function () {
  //add your statement here
});


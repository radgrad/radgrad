import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';

Template.Academic_Semester.helpers({
  semesterName() {
    const semester = Template.instance().state.get('semester');
    if (semester) {
      return semester.term;
    }
    return null;
  },
  isFuture() {
    const semester = Template.instance().state.get('semester');
    const currentSemester = Template.instance().state.get('currentSemester');
    if (semester && currentSemester) {
      return semester.sortBy >= currentSemester.sortBy;
    }
    return null;
  },
  icsCourses() {
    const ret = [];
    if (Template.instance().state.get('semester')) {
      const courses = CourseInstances.find({
        semesterID: Template.instance().state.get('semester')._id,
        studentID: Meteor.userId(),
      }).fetch();
      courses.forEach((c) => {
        if (CourseInstances.isICS(c._id)) {
          ret.push(c);
        }
      });
    }
    return ret;
  },
  nonIcsCourses() {
    const ret = [];
    if (Template.instance().state.get('semester')) {
      const courses = CourseInstances.find({
        semesterID: Template.instance().state.get('semester')._id,
        studentID: Meteor.userId(),
      }).fetch();
      courses.forEach((c) => {
        if (!CourseInstances.isICS(c._id)) {
          ret.push(c);
        }
      });
    }
    return ret;
  },
})
;

Template.Academic_Semester.events({
  // add your events here
});

Template.Academic_Semester.onCreated(function academicSemesterOnCreate() {
  this.state = new ReactiveDict();
});

Template.Academic_Semester.onRendered(function academicSemesterOnRendered() {
  // console.log(this.data);
  if (this.data) {
    this.state.set('semester', this.data.semester);
    this.state.set('currentSemester', this.data.currentSemester);
  }
});

Template.Academic_Semester.onDestroyed(function acdemicSemesterOnDestroyed() {
  // add your statement here
});


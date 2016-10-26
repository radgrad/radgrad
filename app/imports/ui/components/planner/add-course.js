import { Template } from 'meteor/templating';
import { lodash } from 'meteor/erasaur:meteor-lodash';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Courses } from '../../../api/course/CourseCollection.js';
import { makeCourseICE } from '../../../api/ice/IceProcessor.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Users } from '../../../api/user/UserCollection.js';


Template.Add_Course.helpers({
  courseArgs(course) {
    return {
      course,
      ice: makeCourseICE(course, ''),
      studentUsername: Template.instance().data.studentUsername,
      fallYear: Template.instance().data.fallYear,
      springYear: Template.instance().data.springYear,
    };
  },
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
});

Template.Add_Course.events({
  // add your events here
});

Template.Add_Course.onCreated(function () {
  this.state = new ReactiveDict();
});

Template.Add_Course.onRendered(function () {
  console.log(this.data);
  this.state.set('fallYear', this.data.fallYear);
  this.state.set('springYear', this.data.springYear);
  this.state.set('studentUsername', this.data.studentUsername);
});

Template.Add_Course.onDestroyed(function () {
  // add your statement here
});


import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { getRouteUserName } from '../shared/route-user-name';

function getICSCourses(studentID, isPast) {
  const courseInstances = CourseInstances.find({ studentID, verified: isPast, note: /ICS/ }).fetch();
  const taken = [];
  _.map(courseInstances, (ci) => {
    if (_.indexOf(taken, ci) === -1) {
      taken.push(ci);
    }
  });
  return taken;
}

Template.User_Course_Component.helpers({
  count(taken) {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      return getICSCourses(userID, taken).length;
    }
    return 0;
  },
  courseName(c) {
    const course = Courses.findDoc(c.courseID);
    return course.shortName;
  },
  courseNumber(c) {
    const course = Courses.findDoc(c.courseID);
    return course.number;
  },
  coursesPlanned() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      return getICSCourses(userID, false);
    }
    return null;
  },
  coursesTaken() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      return getICSCourses(userID, true);
    }
    return null;
  },
  courseURL(c) {
    const course = Courses.findDoc(c.courseID);
    const slug = Courses.getSlug(course._id);
    return `/student/${getRouteUserName()}/explorer/courses/${slug}`;
  },
});

Template.User_Course_Component.events({
  // add your events here
});

Template.User_Course_Component.onCreated(function userCourseTakenComponentOnCreated() {
  if (this.data.userID) {
    this.userID = this.data.userID;
  }
});

Template.User_Course_Component.onRendered(function userCourseTakenComponentOnRendered() {
  this.$('.ui.accordion').accordion();
});

Template.User_Course_Component.onDestroyed(function userCourseTakenComponentOnDestroyed() {
  // add your statement here
});


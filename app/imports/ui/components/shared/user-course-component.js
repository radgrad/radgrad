import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { getRouteUserName } from '../shared/route-user-name';
import { getGroupName } from './route-group-name';

function getCourses(studentID, isPast) {
  const courseInstances = CourseInstances.find({ studentID, verified: isPast }).fetch();
  return _.uniq(courseInstances);
}

Template.User_Course_Component.helpers({
  count(taken) {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      return getCourses(userID, taken).length;
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
      const courses = getCourses(userID, false);
      const noRepeat = _.map(_.groupBy(courses, function (course) {
        return course.courseID;
      }), function (grouped) {
        return grouped[0];
      });
      return noRepeat;
    }
    return null;
  },
  coursesTaken() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      const courses = getCourses(userID, true);
      const noRepeat = _.map(_.groupBy(courses, function (course) {
        return course.courseID;
      }), function (grouped) {
        return grouped[0];
      });
      return noRepeat;
    }
    return null;
  },
  courseURL(c) {
    const course = Courses.findDoc(c.courseID);
    const slug = Courses.getSlug(course._id);
    const group = getGroupName();
    if (group === 'student') {
      return `/student/${getRouteUserName()}/explorer/courses/${slug}`;
    } else if (group === 'faculty') {
      return `/faculty/${getRouteUserName()}/explorer/courses/${slug}`;
    }
    return `/mentor/${getRouteUserName()}/explorer/courses/${slug}`;
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


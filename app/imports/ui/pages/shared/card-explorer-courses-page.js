import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Card_Explorer_Courses_Page.helpers({
  addedCourses() {
    const addedCourses = [];
    const allCourses = Courses.find({}, { sort: { shortName: 1 } }).fetch();
    const userID = getUserIdFromRoute();
    _.forEach(allCourses, (course) => {
      const ci = CourseInstances.find({
        studentID: userID,
        courseID: course._id,
      }).fetch();
      if (ci.length > 0) {
        if (course.shortName !== 'Non-CS Course') {
          addedCourses.push(course);
        }
      }
    });
    return addedCourses;
  },
  nonAddedCourses() {
    const allCourses = Courses.find({}, { sort: { shortName: 1 } }).fetch();
    const userID = getUserIdFromRoute();
    const nonAddedCourses = _.filter(allCourses, function (course) {
      const ci = CourseInstances.find({
        studentID: userID,
        courseID: course._id,
      }).fetch();
      if (ci.length > 0) {
        return false;
      }
      if (course.shortName === 'Non-CS Course') {
        return false;
      }
      return true;
    });
    return nonAddedCourses;
  },
});

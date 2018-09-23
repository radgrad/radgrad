import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '../../../startup/client/router.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { getUserIdFromRoute } from './get-user-id-from-route';
import { isInRole, isLabel } from '../../utilities/template-helpers';

Template.Explorer_Courses_Widget.helpers({
  color(table) {
    if (table.length === 0) {
      return 'whitesmoke';
    }
    return '';
  },
  courseNameFromSlug(courseSlugName) {
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.find({ slugID: slug[0]._id }).fetch();
    return course[0].shortName;
  },
  coursesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerCoursesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorExplorerCoursesPageRouteName;
  },
  futureInstance(course) {
    let ret = false;
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    _.forEach(ci, function (courseInstance) {
      if (Semesters.findDoc(courseInstance.semesterID).semesterNumber >=
          Semesters.getCurrentSemesterDoc().semesterNumber) {
        ret = true;
      }
    });
    return ret;
  },
  getTableTitle(tableIndex, table) {
    switch (tableIndex) {
      case 0:
        if (table.length !== 0) {
          return '<h4><i class="green checkmark icon"></i>Completed</h4>';
        }
        return '<h4 style="color:grey"><i class="grey checkmark icon"></i>Completed</h4>';
      case 1:
        if (table.length !== 0) {
          return '<h4><i class="yellow warning sign icon"></i>In Plan (Not Yet Completed)</h4>';
        }
        return '<h4 style="color:grey"><i class="grey warning sign icon"></i>In Plan (Not Yet Completed)</h4>';
      case 2:
        if (table.length !== 0) {
          return '<h4><i class="red warning circle icon"></i>Not in Plan</h4>';
        }
        return '<h4 style="color:grey"><i class="grey warning circle icon"></i>Not in Plan</h4>';
      default:
        return 'ERROR: More than one table.';
    }
  },
  isInRole,
  isLabel,
  length(table) {
    return table.length !== 0;
  },
  passedCourse(course) {
    let ret = false;
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    _.forEach(ci, function (c) {
      if (c.grade === 'A+' || c.grade === 'A' || c.grade === 'A-' ||
          c.grade === 'B+' || c.grade === 'B') {
        ret = true;
      }
    });
    return ret;
  },
  review() {
    let review = '';
    review = Reviews.find({
      studentID: getUserIdFromRoute(),
      revieweeID: this.item._id,
    }).fetch();
    return review[0];
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  userStatus(course) {
    let ret = false;
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    if (ci.length > 0) {
      ret = true;
    }
    return ret;
  },
});

import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { getUserIdFromRoute } from './get-user-id-from-route';
import { isInRole, isLabel } from '../../utilities/template-helpers';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { getGroupName } from './route-group-name';

Template.Explorer_Courses_Widget.helpers({
  courseNameFromSlug(courseSlugName) {
    // console.log(courseSlugName);
    const slug = Slugs.findNonRetired({ name: courseSlugName });
    const course = Courses.findDoc({ slugID: slug[0]._id });
    return course.shortName;
  },
  coursesRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerCoursesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorExplorerCoursesPageRouteName;
  },
  courseSemesters(course) {
    const cis = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const semesterNames = _.map(cis, (ci) => {
      const sem = Semesters.findDoc(ci.semesterID);
      if (sem.semesterNumber < currentSemester.semesterNumber) {
        return `Taken ${Semesters.toString(ci.semesterID, false)}`;
      }
      return `In plan ${Semesters.toString(ci.semesterID, false)}`;
    });
    return semesterNames.join(', ');
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
  getStatusIconName(index) {
    switch (index) {
      case 0:
        return 'green checkmark icon';
      case 1:
        return 'yellow warning sign icon';
      default:
        return 'red warning circle icon';
    }
  },
  getStatusTooltip(index) {
    switch (index) {
      case 0:
        return 'Completed';
      case 1:
        return 'In Plan (Not Yet Completed)';
      default:
        return 'Not in Plan';
    }
  },
  hasTeaser(item) {
    const teaser = Teasers.findNonRetired({ targetSlugID: item.slugID });
    return teaser.length > 0;
  },
  isInRole,
  isLabel,
  length(table) {
    return table.length !== 0;
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

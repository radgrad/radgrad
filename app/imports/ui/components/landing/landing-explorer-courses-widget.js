import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { isLabel } from '../../utilities/template-helpers';
import { Teasers } from '../../../api/teaser/TeaserCollection';

Template.Landing_Explorer_Courses_Widget.helpers({
  color(table) {
    if (table.length === 0) {
      return 'whitesmoke';
    }
    return '';
  },
  courseNameFromSlug(courseSlugName) {
    const slug = Slugs.findDoc({ name: courseSlugName });
    const course = Courses.findDoc({ slugID: slug._id });
    return course.shortName;
  },
  coursesRouteName() {
    return RouteNames.landingExplorerCoursesPageRouteName;
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
  hasTeaser(item) {
    const teaser = Teasers.find({ targetSlugID: item.slugID }).fetch();
    return teaser.length > 0;
  },
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
    return '';
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  userStatus(course) { // eslint-disable-line
    return false;
  },
});

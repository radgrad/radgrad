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
import { isSingleChoice } from '../../../api/degree-plan/PlanChoiceUtilities';
import { Teasers } from '../../../api/teaser/TeaserCollection';

Template.Explorer_Courses_Widget.helpers({
  choices(prerequisite) {
    // console.log(prerequisite);
    return prerequisite.course.split(',');
  },
  courseNameFromSlug(courseSlugName) {
    // console.log(courseSlugName);
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.findDoc({ slugID: slug[0]._id });
    return course.shortName;
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
    const teaser = Teasers.find({ targetSlugID: item.slugID }).fetch();
    return teaser.length > 0;
  },
  isInRole,
  isLabel,
  length(table) {
    return table.length !== 0;
  },
  isSingleChoice(prerequisite) {
    // console.log(prerequisite);
    return isSingleChoice(prerequisite.course);
  },
  isFirst(index) {
    return index === 0;
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

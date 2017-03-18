import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { makeLink } from '../../components/admin/datamodel-utilities';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

function passedCourseHelper(courseSlugName) {
  let ret = 'Not in plan';
  const slug = Slugs.find({ name: courseSlugName }).fetch();
  const course = Courses.find({ slugID: slug[0]._id }).fetch();
  const ci = CourseInstances.find({
    studentID: getUserIdFromRoute(),
    courseID: course[0]._id,
  }).fetch();
  _.map(ci, (c) => {
    if (c.verified === true) {
      if (c.grade === 'A+' || c.grade === 'A' || c.grade === 'A-' || c.grade === 'B+' ||
          c.grade === 'B' || c.grade === 'B-' || c.grade === 'CR') {
        ret = 'Completed';
      } else {
        ret = 'In plan, but not yet complete';
      }
    } else {
      ret = 'In plan, but not yet complete';
    }
  });
  return ret;
}

function prerequisites(course) {
  const list = course.prerequisites;
  const complete = [];
  const incomplete = [];
  const notInPlan = [];
  let itemStatus = '';
  _.map(list, (item) => {
    itemStatus = passedCourseHelper(item);
    if (itemStatus === 'Not in plan') {
      notInPlan.push({ course: item, status: itemStatus });
    } else if (itemStatus === 'Completed') {
      complete.push({ course: item, status: itemStatus });
    } else {
      incomplete.push({ course: item, status: itemStatus });
    }
  });
  return [complete, incomplete, notInPlan];
}

Template.Student_Explorer_Courses_Page.helpers({
  addedCourses() {
    const addedCourses = [];
    const allCourses = Courses.find({}, { sort: { shortName: 1 } }).fetch();
    const userID = getUserIdFromRoute();
    _.map(allCourses, (course) => {
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
  completed() {
    let ret = false;
    const courseSlugName = FlowRouter.getParam('course');
    const courseStatus = passedCourseHelper(courseSlugName);
    if (courseStatus === 'Completed') {
      ret = true;
    }
    return ret;
  },
  course() {
    const courseSlugName = FlowRouter.getParam('course');
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.find({ slugID: slug[0]._id }).fetch();
    return course[0];
  },
  descriptionPairs(course) {
    return [
      { label: 'Course Number', value: course.number },
      { label: 'Credit Hours', value: course.creditHrs },
      { label: 'Prerequisites', value: prerequisites(course) },
      { label: 'Description', value: course.description },
      { label: 'Syllabus', value: makeLink(course.syllabus) },
      { label: 'More Information', value: makeLink(course.moreInformation) },
      { label: 'Interests', value: _.sortBy(Interests.findNames(course.interestIDs)) },
    ];
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
  reviewed(course) {
    let ret = false;
    const review = Reviews.find({
      studentID: getUserIdFromRoute(),
      revieweeID: course._id,
    }).fetch();
    if (review.length > 0) {
      ret = true;
    }
    return ret;
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
});


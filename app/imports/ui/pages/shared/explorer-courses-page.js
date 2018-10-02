import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { makeLink } from '../../components/admin/datamodel-utilities';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

function passedCourseHelper(courseSlugName) {
  let ret = 'Not in plan';
  const slug = Slugs.find({ name: courseSlugName }).fetch();
  const course = Courses.find({ slugID: slug[0]._id }).fetch();
  const ci = CourseInstances.find({
    studentID: getUserIdFromRoute(),
    courseID: course[0]._id,
  }).fetch();
  _.forEach(ci, (c) => {
    if (c.verified === true) {
      ret = 'Completed';
    } else if (ret !== 'Completed') {
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
  _.forEach(list, (item) => {
    itemStatus = passedCourseHelper(item);
    if (itemStatus === 'Not in plan') {
      notInPlan.push({ course: item, status: itemStatus });
    } else if (itemStatus === 'Completed') {
      complete.push({ course: item, status: itemStatus });
    } else {
      incomplete.push({ course: item, status: itemStatus });
    }
  });
  if (complete.length === 0 && incomplete.length === 0 && notInPlan.length === 0) {
    return null;
  }
  return [complete, incomplete, notInPlan];
}

Template.Explorer_Courses_Page.helpers({
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
      { label: 'Description', value: course.description },
      { label: 'Syllabus', value: makeLink(course.syllabus) },
      { label: 'Interests', value: _.sortBy(Interests.findNames(course.interestIDs)) },
      { label: 'Prerequisites', value: prerequisites(course) },
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


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
import { isSingleChoice } from '../../../api/degree-plan/PlanChoiceUtilities';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
// import { Teasers } from '../../../api/teaser/TeaserCollection';


function passedCourseHelper(courseSlugName) {
  let ret = 'Not in plan';
  const slug = Slugs.find({ name: courseSlugName })
    .fetch();
  const course = Courses.find({ slugID: slug[0]._id }).fetch();
  const ci = CourseInstances.find({
    studentID: getUserIdFromRoute(),
    courseID: course[0]._id,
  })
    .fetch();
  _.forEach(ci, (c) => {
    if (c.verified === true) {
      ret = 'Completed';
    } else if (ret !== 'Completed') {
      ret = 'In plan, but not yet complete';
    }
  });
  return ret;
}

function prerequisiteStatus(prerequisite) {
  // console.log(prerequisite);
  if (isSingleChoice(prerequisite)) {
    return passedCourseHelper(prerequisite);
  }
  const slugs = prerequisite.split(',');
  let ret = 'Not in plan';
  slugs.forEach((slug) => {
    const result = passedCourseHelper(slug);
    if (result === 'Completed') {
      ret = result;
    } else if (result === 'In plan, but not yet complete') {
      ret = result;
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
    itemStatus = prerequisiteStatus(item);
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
  // console.log(complete, incomplete, notInPlan);
  return [complete, incomplete, notInPlan];
}

Template.Explorer_Courses_Page.helpers({
  addedCourses() {
    const studentID = getUserIdFromRoute();
    const favorites = FavoriteCourses.find({ studentID }).fetch();
    return _.map(favorites, (f) => ({ item: Courses.findDoc(f.courseID), count: 1 }));
  },
  completed() {
    let ret = false;
    const courseSlugName = FlowRouter.getParam('course');
    if (courseSlugName) {
      const courseStatus = passedCourseHelper(courseSlugName);
      if (courseStatus === 'Completed') {
        ret = true;
      }
    }
    return ret;
  },
  course() {
    const courseSlugName = FlowRouter.getParam('course');
    if (courseSlugName) {
      const slug = Slugs.find({ name: courseSlugName })
        .fetch();
      const course = Courses.findDoc({ slugID: slug[0]._id });
      return course;
    }
    return '';
  },
  descriptionPairs(course) {
    if (course) {
      return [
        { label: 'Course Number', value: course.number },
        { label: 'Credit Hours', value: course.creditHrs },
        { label: 'Description', value: course.description },
        { label: 'Syllabus', value: makeLink(course.syllabus) },
        { label: 'Interests', value: _.sortBy(Interests.findNames(course.interestIDs)) },
        { label: 'Prerequisites', value: prerequisites(course) },
      ];
    }
    return [];
  },
  nonAddedCourses() {
    const allCourses = Courses.findNonRetired({}, { sort: { shortName: 1 } });
    const studentID = getUserIdFromRoute();
    const favoriteIDs = _.map(FavoriteCourses.find({ studentID }).fetch(), (f) => f.courseID);

    const nonAddedCourses = _.filter(allCourses, function (course) {
      return !_.includes(favoriteIDs, course._id);
    });
    return nonAddedCourses;
  },
  reviewed(course) {
    let ret = false;
    if (course) {
      const review = Reviews.find({
        studentID: getUserIdFromRoute(),
        revieweeID: course._id,
      })
        .fetch();
      if (review.length > 0) {
        ret = true;
      }
    }
    return ret;
  },
  slugName(slugID) {
    if (slugID) {
      return Slugs.findDoc(slugID).name;
    }
    return '';
  },
});

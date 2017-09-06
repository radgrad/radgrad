import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from './CourseInstanceCollection';
import { Courses } from './CourseCollection';
import PreferredChoice from '../degree-plan/PreferredChoice';
import { Users } from '../user/UserCollection';
// import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
// import { clearFeedbackInstancesMethod, feedbackInstancesDefineMethod,
//   feedbackInstancesRemoveItMethod } from '../feedback/FeedbackInstanceCollection.methods';
// import { Feedbacks } from '../feedback/FeedbackCollection';
// import { Semesters } from '../semester/SemesterCollection';
// import { Slugs } from '../slug/SlugCollection';

/**
 * Returns true if the coursesTakenSlugs fulfills courseID's prerequisites.
 * @memberOf api/course
 * @param coursesTakenSlugs slugs of the courses taken.
 * @param courseID course ID.
 * @return {boolean}
 * @memberOf api/course
 */
export function prereqsMet(coursesTakenSlugs, courseID) {
  const course = Courses.findDoc(courseID);
  let ret = true;
  _.forEach(course.prerequisites, (prereq) => {
    if (_.indexOf(coursesTakenSlugs, prereq) === -1) {
      ret = false;
      return false;
    }
    return true;
  });
  return ret;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);  // eslint-disable-line no-param-reassign
  max = Math.floor(max);  // eslint-disable-line no-param-reassign
  return Math.floor(Math.random() * (max - min)) + min;
}

export function clearPlannedCourseInstances(studentID) {
  const courses = CourseInstances.find({ studentID, verified: false, fromSTAR: false }).fetch();
  _.forEach(courses, (ci) => {
    CourseInstances.removeIt(ci);
  });
}

export function get300LevelDocs() {
  const courses = Courses.find({ number: /3\d\d/ }).fetch();
  return courses;
}

export function getStudent300LevelDocs(studentID, coursesTakenSlugs) {
  let ret = [];
  const courses = get300LevelDocs();
  const instances = CourseInstances.find({ studentID }).fetch();
  const courseTakenIDs = [];
  instances.forEach((courseInstance) => {
    if (CourseInstances.isInteresting(courseInstance._id)) {
      if (courseInstance.note !== 'ICS 499') {
        courseTakenIDs.push(courseInstance.courseID);
      }
    }
  });
  ret = _.filter(courses, function filter(c) {
    return _.indexOf(courseTakenIDs, c._id) === -1;
  });
  ret = _.filter(ret, function filter(c) {
    return prereqsMet(coursesTakenSlugs, c._id);  // remove courses that don't have the prerequisites
  });
  return ret;
}

export function bestStudent300LevelCourses(studentID, coursesTakenSlugs) {
  const choices = getStudent300LevelDocs(studentID, coursesTakenSlugs);
  const interestIDs = Users.getProfile(studentID).interestIDs;
  const preferred = new PreferredChoice(choices, interestIDs);
  return preferred.getBestChoices();
}

export function chooseStudent300LevelCourse(studentID, coursesTakenSlugs) {
  const best = bestStudent300LevelCourses(studentID, coursesTakenSlugs);
  return best[getRandomInt(0, best.length)];
}

export function get400LevelDocs() {
  const courses = Courses.find({ number: /4\d\d/ }).fetch();
  return courses;
}

export function getStudent400LevelDocs(studentID, coursesTakenSlugs) {
  let ret = [];
  const courses = get400LevelDocs();
  const instances = CourseInstances.find({ studentID }).fetch();
  const courseTakenIDs = [];
  instances.forEach((courseInstance) => {
    if (CourseInstances.isInteresting(courseInstance._id)) {
      if (!courseInstance.note.endsWith('499')) {
        courseTakenIDs.push(courseInstance.courseID);
      }
    }
  });
  ret = _.filter(courses, function filter(c) {
    return _.indexOf(courseTakenIDs, c._id) === -1;
  });
  ret = _.filter(ret, function filter(c) {
    return prereqsMet(coursesTakenSlugs, c._id);  // remove courses that don't have the prerequisites
  });
  return ret;
}

export function bestStudent400LevelCourses(studentID, coursesTakenSlugs) {
  const choices = getStudent400LevelDocs(studentID, coursesTakenSlugs);
  const interestIDs = Users.getProfile(studentID).interestIDs;
  const preferred = new PreferredChoice(choices, interestIDs);
  return preferred.getBestChoices();
}

export function chooseStudent400LevelCourse(studentID, coursesTakenSlugs) {
  const best = bestStudent400LevelCourses(studentID, coursesTakenSlugs);
  return best[getRandomInt(0, best.length)];
}

/**
 * Chooses the 'best' course to take given an array of slugs, the student and the courses the student
 * has taken.
 * @param slugs an array of course slugs to choose between.
 * @param studentID the student's ID.
 * @param coursesTakenSlugs an array of the course slugs the student has taken.
 * @returns {*}
 * @memberOf api/course
 */
export function chooseBetween(slugs, studentID, coursesTakenSlugs) {
  // console.log('chooseBetween', slugs, coursesTakenSlugs);
  const courses = [];
  _.forEach(slugs, (slug) => {
    const courseID = Courses.getID(slug);
    if (prereqsMet(coursesTakenSlugs, courseID)) {
      courses.push(Courses.findDoc(courseID));
    }
  });
  const interestIDs = Users.getProfile(studentID).interestIDs;
  const preferred = new PreferredChoice(courses, interestIDs);
  const best = preferred.getBestChoices();
  if (best) {
    // console.log('chooseBetween', best, interestIDs);
    return best[getRandomInt(0, best.length)];
  }
  return null;
}

/**
 * Returns the department from the given course slug.
 * @param courseSlug the course slug.
 * @returns {string}
 * @memberOf api/course
 */
export function getDepartment(courseSlug) {
  return courseSlug.split('_')[0].toUpperCase();
}

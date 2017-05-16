import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from './CourseInstanceCollection';
import { Courses } from './CourseCollection';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { Feedbacks } from '../feedback/FeedbackCollection';
import PreferredChoice from '../preference/PreferredChoice';
import { Semesters } from '../semester/SemesterCollection';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';

/** @module api/course/CourseUtilities */

function clearFeedbackInstances(userID, area) {
  const instances = FeedbackInstances.find({ userID, area }).fetch();
  instances.forEach((i) => {
    FeedbackInstances.removeIt(i._id);
  });
}

export function prereqsMet(coursesTakenSlugs, courseID) {
  const course = Courses.findDoc(courseID);
  let ret = true;
  _.map(course.prerequisites, (prereq) => {
    if (_.indexOf(coursesTakenSlugs, prereq) === -1) {
      ret = false;
      return false;
    }
    return true;
  });
  return ret;
}

/**
 * Checks all the CourseInstances to ensure that the prerequisites are fulfilled.
 */
export function checkPrerequisites(studentID, area) {
  const f = Feedbacks.find({ name: 'Prerequisite missing' }).fetch()[0];
  const feedback = Slugs.getEntityID(f.slugID, 'Feedback');
  clearFeedbackInstances(studentID, area);
  const cis = CourseInstances.find({ studentID }).fetch();
  cis.forEach((ci) => {
    const semester = Semesters.findDoc(ci.semesterID);
    const semesterName = Semesters.toString(ci.semesterID, false);
    const course = Courses.findDoc(ci.courseID);
    if (course) {
      const prereqs = course.prerequisites;
      prereqs.forEach((p) => {
        const courseID = Slugs.getEntityID(p, 'Course');
        const prerequisiteCourse = Courses.find({ _id: courseID }).fetch()[0];
        const preCiIndex = _.findIndex(cis, function find(obj) {
          return obj.courseID === courseID;
        });
        if (preCiIndex !== -1) {
          const preCi = cis[preCiIndex];
          const preCourse = Courses.findDoc(preCi.courseID);
          const preSemester = Semesters.findDoc(preCi.semesterID);
          if (preSemester) {
            if (preSemester.sortBy >= semester.sortBy) {
              const semesterName2 = Semesters.toString(preSemester._id, false);
              const description = `${semesterName}: ${course.number}'s prerequisite ${preCourse.number} is after or` +
                  ` in ${semesterName2}.`;
              FeedbackInstances.define({
                feedback,
                user: studentID,
                description,
                area,
              });
            }
          }
        } else {
          const description = `${semesterName}: Prerequisite ${prerequisiteCourse.number} for ${course.number}` +
              ' not found.';
          FeedbackInstances.define({
            feedback,
            user: studentID,
            description,
            area,
          });
        }
      });
    }
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);  // eslint-disable-line no-param-reassign
  max = Math.floor(max);  // eslint-disable-line no-param-reassign
  return Math.floor(Math.random() * (max - min)) + min;
}

export function clearPlannedCourseInstances(studentID) {
  const courses = CourseInstances.find({ studentID, verified: false, fromSTAR: false }).fetch();
  _.map(courses, (ci) => {
    CourseInstances.removeIt(ci);
  });
}

export function get300LevelDocs() {
  const courses = Courses.find({ number: /ICS 3/ }).fetch();  // TODO don't just look for ICS courses.
  return courses;
}

export function getStudent300LevelDocs(studentID, coursesTakenSlugs) {
  let ret = [];
  const courses = get300LevelDocs();
  const instances = CourseInstances.find({ studentID }).fetch();
  const courseTakenIDs = [];
  instances.forEach((courseInstance) => {
    if (CourseInstances.isICS(courseInstance._id)) {
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
  const interestIDs = Users.getInterestIDs(studentID);
  const preferred = new PreferredChoice(choices, interestIDs);
  return preferred.getBestChoices();
}

export function chooseStudent300LevelCourse(studentID, coursesTakenSlugs) {
  const best = bestStudent300LevelCourses(studentID, coursesTakenSlugs);
  return best[getRandomInt(0, best.length)];
}

export function get400LevelDocs() {
  const courses = Courses.find({ number: /ICS 4/ }).fetch();  // TODO: Don't just look for ICS courses.
  return courses;
}

export function getStudent400LevelDocs(studentID, coursesTakenSlugs) {
  let ret = [];
  const courses = get400LevelDocs();
  const instances = CourseInstances.find({ studentID }).fetch();
  const courseTakenIDs = [];
  instances.forEach((courseInstance) => {
    if (CourseInstances.isICS(courseInstance._id)) {
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

export function bestStudent400LevelCourses(studentID, coursesTakenSlugs) {
  const choices = getStudent400LevelDocs(studentID, coursesTakenSlugs);
  const interestIDs = Users.getInterestIDs(studentID);
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
 */
export function chooseBetween(slugs, studentID, coursesTakenSlugs) {
  // console.log('chooseBetween', slugs, coursesTakenSlugs);
  const courses = [];
  _.map(slugs, (slug) => {
    const courseID = Courses.getID(slug);
    if (prereqsMet(coursesTakenSlugs, courseID)) {
      courses.push(Courses.findDoc(courseID));
    }
  });
  const interestIDs = Users.getInterestIDs(studentID);
  const preferred = new PreferredChoice(courses, interestIDs);
  const best = preferred.getBestChoices();
  if (best) {
    // console.log('chooseBetween', best, interestIDs);
    return best[getRandomInt(0, best.length)];
  }
  return null;
}

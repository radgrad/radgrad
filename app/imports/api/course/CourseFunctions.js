import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from './CourseInstanceCollection';
import { Courses } from './CourseCollection';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { Feedbacks } from '../feedback/FeedbackCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';

const clearFeedbackInstances = (userID, area) => {
  const instances = FeedbackInstances.find({ userID, area }).fetch();
  instances.forEach((i) => {
    FeedbackInstances.removeIt(i._id);
  });
};

/**
 * Checks all the CourseInstances to ensure that the prerequisites are fulfilled.
 */
export const checkPrerequisites = (studentID, area) => {
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
              'not found.';
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
};

function getRandomInt(min, max) {
  min = Math.ceil(min);  // eslint-disable-line no-param-reassign
  max = Math.floor(max);  // eslint-disable-line no-param-reassign
  return Math.floor(Math.random() * (max - min)) + min;
}

export const clearPlannedCourseInstances = (studentID) => {
  const courses = CourseInstances.find({ studentID, verified: false }).fetch();
  _.map(courses, (ci) => {
    CourseInstances.removeIt(ci);
  });
};

export const calculateCompatibility = (courseID, studentID) => {
  const course = Courses.findDoc(courseID);
  const student = Users.findDoc(studentID);
  const intersection = _.intersection(course.interestIDs, student.interestIDs);
  return intersection.length;
};

export const get100LevelDocs = () => {
  let ret = [];
  const courses = Courses.find().fetch();
  ret = _.filter(courses, function filter(c) {
    if (c.number.startsWith('ICS 1')) {
      return true;
    }
    return false;
  });
  return ret;
};

export const get100LevelDocsWithInterest = (interestID) => {
  const courses = get100LevelDocs();
  return _.filter(courses, function filter(c) {
    return _.indexOf(c.interestIDs, interestID) !== -1;
  });
};

export const get200LevelDocs = () => {
  let ret = [];
  const courses = Courses.find().fetch();
  ret = _.filter(courses, function filter(c) {
    if (c.number.startsWith('ICS 2')) {
      return true;
    }
    return false;
  });
  return ret;
};

export const getStudent200LevelDocs = (studentID) => {
  let ret = [];
  const courses = get200LevelDocs();
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
  return ret;
};

export const get300LevelDocs = () => {
  let ret = [];
  const courses = Courses.find().fetch();
  ret = _.filter(courses, function filter(c) {
    if (c.number.startsWith('ICS 3')) {
      return true;
    }
    return false;
  });
  return ret;
};

export const getStudent300LevelDocs = (studentID) => {
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
  return ret;
};

export const getStudent300LevelChoices = (studentID) => {
  const arr = {};
  let max = 0;
  const available = getStudent300LevelDocs(studentID);
  _.map(available, (course) => {
    const score = calculateCompatibility(course._id, studentID);
    if (score > max) {
      max = score;
    }
    if (!arr[score]) {
      arr[score] = [];
    }
    arr[score].push(course);
  });
  arr.max = max;
  return arr;
};

export const chooseStudent300LevelCourse = (studentID) => {
  const choices = getStudent300LevelChoices(studentID);
  const best = choices[choices.max];
  return best[getRandomInt(0, best.length)];
};

export const get400LevelDocs = () => {
  let ret = [];
  const courses = Courses.find().fetch();
  ret = _.filter(courses, function filter(c) {
    if (c.number.startsWith('ICS 4')) {
      return true;
    }
    return false;
  });
  return ret;
};

export const get400LevelDocsWithInterest = (interestID) => {
  const courses = get400LevelDocs();
  return _.filter(courses, function filter(c) {
    return _.indexOf(c.interestIDs, interestID) !== -1;
  });
};
export const getStudent400LevelDocs = (studentID) => {
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
  return ret;
};

export const getStudent400LevelChoices = (studentID) => {
  const arr = {};
  let max = 0;
  const available = getStudent400LevelDocs(studentID);
  _.map(available, (course) => {
    const score = calculateCompatibility(course._id, studentID);
    if (score > max) {
      max = score;
    }
    if (!arr[score]) {
      arr[score] = [];
    }
    arr[score].push(course);
  });
  arr.max = max;
  return arr;
};

export const chooseStudent400LevelCourse = (studentID) => {
  const choices = getStudent400LevelChoices(studentID);
  const best = choices[choices.max];
  return best[getRandomInt(0, best.length)];
};

export const getCourseDocsWithInterest = (interestID) => {
  const courses = Courses.find().fetch();
  return _.filter(courses, function filter(c) {
    return _.indexOf(c.interestIDs, interestID) !== -1;
  });
};

export const chooseBetween = (slugs, studentID) => {
  const courses = [];
  _.map(slugs, (slug) => {
    const courseID = Courses.getID(slug);
    courses.push(Courses.findDoc(courseID));
  });
  const arr = {};
  let max = 0;
  _.map(courses, (course) => {
    const score = calculateCompatibility(course._id, studentID);
    if (score > max) {
      max = score;
    }
    if (!arr[score]) {
      arr[score] = [];
    }
    arr[score].push(course);
  });
  arr.max = max;
  const best = arr[arr.max];
  return best[getRandomInt(0, best.length)];
};

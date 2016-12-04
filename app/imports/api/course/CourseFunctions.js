import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from './CourseInstanceCollection';
import { Courses } from './CourseCollection';
import { Users } from '../user/UserCollection';

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

export const get200LevelDocsWithInterest = (interestID) => {
  const courses = get200LevelDocs();
  return _.filter(courses, function filter(c) {
    return _.indexOf(c.interestIDs, interestID) !== -1;
  });
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

export const get300LevelDocsWithInterest = (interestID) => {
  const courses = get300LevelDocs();
  return _.filter(courses, function filter(c) {
    return _.indexOf(c.interestIDs, interestID) !== -1;
  });
};

export const get300LevelChoices = (interestID, studentID) => {
  let ret = [];
  const choices = get300LevelDocsWithInterest(interestID);
  const instances = CourseInstances.find({ studentID }).fetch();
  const courseTakenIDs = [];
  instances.forEach((courseInstance) => {
    if (CourseInstances.isICS(courseInstance._id)) {
      if (courseInstance.note !== 'ICS 499') {
        courseTakenIDs.push(courseInstance.courseID);
      }
    }
  });
  ret = _.filter(choices, function filter(c) {
    if (c.number === 'other') {
      return false;
    }
    if (!c.number.startsWith('ICS 3')) {
      return false;
    }
    return _.indexOf(courseTakenIDs, c._id) === -1;
  });
  return ret;
};

export const getStudent300LevelChoices = (studentID) => {
  const arr = {};
  const student = Users.findDoc(studentID);
  _.map(student.interestIDs, (interestID) => {
    _.map(get300LevelChoices(interestID, studentID), (course) => {
      if (!arr[course.number]) {
        arr[course.number] = 1;
      } else {
        arr[course.number] += 1;
      }
    });
  });
  return arr;
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

export const getCourseDocsWithInterest = (interestID) => {
  const courses = Courses.find().fetch();
  return _.filter(courses, function filter(c) {
    return _.indexOf(c.interestIDs, interestID) !== -1;
  });
};

export const get400LevelChoices = (interestID, studentID) => {
  let ret = [];
  const choices = get400LevelDocsWithInterest(interestID);
  const instances = CourseInstances.find({ studentID }).fetch();
  const courseTakenIDs = [];
  instances.forEach((courseInstance) => {
    if (CourseInstances.isICS(courseInstance._id)) {
      if (courseInstance.note !== 'ICS 499') {
        courseTakenIDs.push(courseInstance.courseID);
      }
    }
  });
  ret = _.filter(choices, function filter(c) {
    if (c.number === 'other') {
      return false;
    }
    if (!c.number.startsWith('ICS 4')) {
      return false;
    }
    return _.indexOf(courseTakenIDs, c._id) === -1;
  });
  return ret;
};

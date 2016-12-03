import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from './CourseCollection';

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


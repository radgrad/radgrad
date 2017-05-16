import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicYearInstances } from './AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';

/** @module api/year/AcademicYearUtilities */

/**
 * Returns the student's current semester number (i.e. which semester are they currently in.)
 * @param studentID the studentID.
 * @returns {number}
 */
export function getStudentsCurrentSemesterNumber(studentID) {
  const cis = CourseInstances.find({ studentID }).fetch();
  let firstSemester;
  _.map(cis, (ci) => {
    const semester = Semesters.findDoc(ci.semesterID);
    if (!firstSemester) {
      firstSemester = semester;
    } else if (semester.sortBy < firstSemester.sortBy) {
      firstSemester = semester;
    }
  });
  const currentSemester = Semesters.getCurrentSemesterDoc();
  return (currentSemester.semesterNumber - firstSemester.semesterNumber) + 1;
}

/**
 * Returns an array of the semesterIDs that the student has taken or is planning to take courses or opportunities
 * in.
 * @param studentID the studentID.
 */
export function getStudentSemesters(studentID) {
  const years = AcademicYearInstances.find({ studentID }, { $sort: { year: 1 } }).fetch();
  let semesters = [];
  _.map(years, (ay) => {
    semesters = _.concat(semesters, ay.semesterIDs);
  });
  const cis = CourseInstances.find({ studentID }).fetch();
  let courseSemesters = [];
  _.map(cis, (ci) => {
    courseSemesters.push(ci.semesterID);
  });
  courseSemesters = _.uniq(courseSemesters);
  return semesters;
}

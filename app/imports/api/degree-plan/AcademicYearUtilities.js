import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicYearInstances } from './AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';

/**
 * Returns the student's current semester number (i.e. which semester are they currently in.)
 * @param studentID the studentID.
 * @returns {number}
 * @memberOf api/degree-plan
 */
export function getStudentsCurrentSemesterNumber(studentID) {
  const cis = CourseInstances.find({ studentID }).fetch();
  let firstSemester;
  _.forEach(cis, (ci) => {
    const semester = Semesters.findDoc(ci.semesterID);
    if (!firstSemester) {
      firstSemester = semester;
    } else if (semester.semesterNumber < firstSemester.semesterNumber) {
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
 * @memberOf api/degree-plan
 */
export function getStudentSemesters(studentID) {
  const years = AcademicYearInstances.find({ studentID }, { $sort: { year: 1 } }).fetch();
  let semesters = [];
  _.forEach(years, (ay) => {
    semesters = _.concat(semesters, ay.semesterIDs);
  });
  const cis = CourseInstances.find({ studentID }).fetch();
  let courseSemesters = [];
  _.forEach(cis, (ci) => {
    courseSemesters.push(ci.semesterID);
  });
  courseSemesters = _.uniq(courseSemesters);
  return semesters;
}

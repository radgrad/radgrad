import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';

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

import { AcademicYearInstances } from './AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';

export function getCurrentSemesterNumber(studentID) {
  const years = AcademicYearInstances.find({ studentID }, { $sort: { year: 1 } }).fetch();
  const cis = CourseInstances.find({ studentID }).fetch();
}

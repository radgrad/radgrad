import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from './CourseCollection';
import { CourseInstances } from './CourseInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';
import { nextSemester } from '../semester/SemesterUtilities';

/**
 * Returns an array with two elements: a string with the shortName of the semester, and an integer indicating the
 * current planned enrollment for the course in that semester.
 * @param courseID The ID of the course.
 * @param semesterID The ID of the semester.
 */
function getEnrollmentData(courseID, semesterID) {
  const semesterShortName = Semesters.getShortName(semesterID);
  const enrollment = CourseInstances._collection.find({ semesterID, courseID }).count();
  return [semesterShortName, enrollment];
}

/**
 * Given a courseID, returns enrollment data for the upcoming 9 semesters.
 * The returned data is an array of arrays, with
 */
export const getFutureEnrollmentMethod = new ValidatedMethod({
  name: 'CourseCollection.getFutureEnrollment',
  mixins: [CallPromiseMixin],
  validate: null,
  run(courseID) {
    // Throw error if an invalid courseID is passed.
    Courses.assertDefined(courseID);
    // Create an array of the upcoming 9 semesters after the current semester.
    let semesterDoc = Semesters.getCurrentSemesterDoc();
    const semesterList = [];
    for (let i = 0; i < 9; i++) {
      semesterDoc = nextSemester(semesterDoc);
      semesterList.push(semesterDoc);
    }
    // Map over these semesters and return a new list that includes the enrollment data for this course and semester.
    const enrollmentData = _.map(semesterList, doc => getEnrollmentData(courseID, Semesters.getID(doc)));
    return enrollmentData;
  },
});

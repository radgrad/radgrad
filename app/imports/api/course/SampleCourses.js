import { Semesters } from '../semester/SemesterCollection';
import { Courses } from '../course/CourseCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { makeSampleInterest } from '../interest/SampleInterests';
import { moment } from 'meteor/momentjs:moment';


/** @module api/course/SampleCourses */

/**
 * The name of the sample course.
 * @type {string}
 */
export const sampleCourseName = 'Sample Course';

/**
 * Creates a Course with a unique slug and returns its docID.
 * @param args An optional object containing arguments to the courses.define function.
 * @returns { String } The docID of the newly generated Course.
 */
export function makeSampleCourse(args) {
  const name = sampleCourseName;
  const uniqueString = moment().format('YYYYMMDDHHmmssSSSSS');
  const slug = `course-${uniqueString}`;
  const number = (args && args.number) ? args.number : `Course ${uniqueString}`;
  const description = 'Sample course description';
  const creditHrs = 3;
  const interestID = (args && args.interestID) ? args.interestID : makeSampleInterest();
  const interests = [interestID];
  return Courses.define({ name, slug, number, description, creditHrs, interests });
}

/**
 * Creates a CourseInstance with a unique slug and returns its docID.
 * Also creates a new Course.
 * @param student The student slug associated with this course.
 * @param args Optional object providing arguments to the CourseInstance definition.
 * @returns { String } The docID for the newly generated Interest.
 */
export function makeSampleCourseInstance(student, args) {
  const semester = Semesters.define({ term: Semesters.FALL, year: 2013 });
  const course = (args && args.course) ? args.course : makeSampleCourse();
  const verified = true;
  const grade = 'A';
  return CourseInstances.define({ semester, course, verified, grade, student });
}

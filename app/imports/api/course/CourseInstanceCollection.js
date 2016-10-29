import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Courses } from '/imports/api/course/CourseCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Users } from '/imports/api/user/UserCollection';
import BaseCollection from '/imports/api/base/BaseCollection';
import { makeCourseICE } from '/imports/api/ice/IceProcessor';

/** @module CourseInstance */

/**
 * Represents the taking of a course by a specific student in a specific semester.
 * @extends module:Base~BaseCollection
 */
class CourseInstanceCollection extends BaseCollection {
  /**
   * Creates the CourseInstance collection.
   */
  constructor() {
    super('CourseInstance', new SimpleSchema({
      semesterID: { type: SimpleSchema.RegEx.Id },
      courseID: { type: SimpleSchema.RegEx.Id, optional: true },
      verified: { type: Boolean },
      grade: { type: String, optional: true },
      creditHrs: { type: Number },
      note: { type: String, optional: true },
      studentID: { type: SimpleSchema.RegEx.Id },
      ice: { type: Object, optional: true, blackbox: true },
    }));
    this.validGrades = ['', 'A', 'A+', 'A-',
      'B', 'B+', 'B-', 'C', 'C+', 'C-', 'D', 'D+', 'D-', 'F', 'CR', 'NC', '***', 'W'];
  }

  /**
   * Defines a new CourseInstance.
   * @example
   * // To define an instance of a CS course:
   * CourseInstances.define({ semester: 'Spring-2016',
   *                          course: 'ics311',
   *                          verified: false,
   *                          grade: 'B',
   *                          student: 'joesmith' });
   * // To define an instance of a non-CS course:
   * CourseInstances.define({ semester: 'Spring-2016',
   *                          course: 'other',
   *                          note: 'ENG 101',
   *                          verified: true,
   *                          creditHrs: 3,
   *                          grade: 'B',
   *                          student: 'joesmith' });
   * @param { Object } description Object with keys semester, course, verified, notCS, grade, studen.
   * Required fields: semester, student, course, which must all be valid slugs or instance IDs.
   * If the course slug is 'other', then the note field will be used as the course number.
   * Optional fields: note (defaults to ''), valid (defaults to false), grade (defaults to '').
   * CreditHrs defaults to the creditHrs assigned to course, or can be provided explicitly.
   * @throws {Meteor.Error} If the definition includes an undefined course or student.
   * @returns The newly created docID.
   */
  define({ semester, course, verified = false, grade = '', note = '', student, creditHrs }) {
    // Check arguments
    const semesterID = Semesters.getID(semester);
    const courseID = Courses.getID(course);
    const studentID = Users.getID(student);
    const ice = makeCourseICE(course, grade);
    if ((typeof verified) !== 'boolean') {
      throw new Meteor.Error(`${verified} is not a boolean.`);
    }
    if (!_.includes(this.validGrades, grade)) {
      throw new Meteor.Error(`${grade} is not a valid grade.`);
    }
    /* eslint no-param-reassign: "off" */
    if (!creditHrs) {
      creditHrs = Courses.findDoc(courseID).creditHrs;
    }
    // Define and return the CourseInstance
    return this._collection.insert({ semesterID, courseID, verified, grade, studentID, creditHrs, note, ice });
  }

  /**
   * @returns { String } The course name associated with courseInstanceID.
   * @param courseInstanceID The course instance ID.
   * @throws {Meteor.Error} If courseInstanceID is not a valid ID.
   */
  findCourseName(courseInstanceID) {
    this.assertDefined(courseInstanceID);
    const courseID = this.findDoc(courseInstanceID).courseID;
    return Courses.findDoc(courseID).name;
  }

  /**
   * @returns { boolean } If the course is an ICS course associated with courseInstanceID.
   * @param courseInstanceID The course instance ID.
   * @throws {Meteor.Error} If courseInstanceID is not a valid ID.
   */
  isICS(courseInstanceID) {
    this.assertDefined(courseInstanceID);
    const courseID = this.findDoc(courseInstanceID).courseID;
    return Courses.findDoc(courseID).number.substring(0, 3) === 'ICS';
  }
  /**
   * @returns {String} A formatted string representing the course instance.
   * @param courseInstanceID The course instance ID.
   * @throws {Meteor.Error} If not a valid ID.
   */
  toString(courseInstanceID) {
    this.assertDefined(courseInstanceID);
    const courseInstanceDoc = this.findDoc(courseInstanceID);
    const courseName = this.findCourseName(courseInstanceID);
    const semester = Semesters.toString(courseInstanceDoc.semesterID);
    const grade = courseInstanceDoc.grade;
    return `[CI ${semester} ${courseName} ${grade}]`;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const CourseInstances = new CourseInstanceCollection();


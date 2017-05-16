import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { processStarCsvData } from './StarProcessor';
import { AcademicYearInstances } from '../year/AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { Semesters } from '../semester/SemesterCollection';
import { StarDataLogs } from './StarDataLogCollection';
import { Users } from '../user/UserCollection';

/** @module api/star/StarProcessorMethods */

/**
 * Processes the student's star data creating CourseInstances.
 * @param student the student's username.
 * @param csvData the student's STAR data.
 */
export function processStudentStarCsvData(student, csvData) {
  // console.log(`loadStarCsvData ${student} ${csvData}`);
  const definitions = processStarCsvData(student, csvData);
  const studentID = Users.findDoc({ username: student })._id;
  const oldInstances = CourseInstances.find({ studentID, fromSTAR: true }).fetch();
  _.map(oldInstances, (instance) => {
    CourseInstances.removeIt(instance._id);
  });
  let numIcsCourses = 0;
  // let numOtherCourses = 0;
  // console.log('create new instances');
  _.map(definitions, (definition) => {
    // console.log(definition);
    const semesterID = Semesters.findIdBySlug(definition.semester);
    // console.log('semesterID', semesterID);
    if (definition.course !== 'other') {
      numIcsCourses += 1;
      const courseID = Courses.findIdBySlug(definition.course);
      // console.log('courseID', courseID);
      const planning = CourseInstances.find({ semesterID, courseID, verified: false }).fetch();
      // console.log('planning', planning);
      if (planning.length > 0) {
        CourseInstances.removeIt(planning[0]._id);
      }
    } else {
      // numOtherCourses += 1;
    }
    definition.fromSTAR = true; // eslint-disable-line
    if (definition.grade === '***') {
      definition.grade = 'B';  // eslint-disable-line
      definition.verified = false; // eslint-disable-line
    }
    // console.log('CourseInstances.define', definition);
    if (definition.course !== 'other') {
      CourseInstances.define(definition);
    }
    const split = definition.semester.split('-');
    let yearVal = parseInt(split[1], 10);
    if (split[0] !== 'Fall') {
      yearVal -= 1;
    }
    // console.log('AcademicYearInstances.define', student, yearVal);
    return AcademicYearInstances.define({ student, year: yearVal });
    // return true;
  });

  const note = `Uploaded ${numIcsCourses} ICS courses.`;
  StarDataLogs.define({ student, note });
}

// TODO make this a ValidatedMethod.
Meteor.methods({
  'StarProcessor.loadStarCsvData': function process(s, c) {
    check(s, String);
    check(c, String);
    processStudentStarCsvData(s, c);
  },
});


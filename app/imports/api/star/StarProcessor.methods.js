import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { processStarCsvData } from './StarProcessor';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { Semesters } from '../semester/SemesterCollection';
import { AdvisorLogs } from '../log/AdvisorLogCollection';
import { Users } from '../user/UserCollection';
import { getDepartment } from '../course/CourseUtilities';

/** @module api/star/StarProcessorMethods */

/**
 * Processes the student's star data creating CourseInstances.
 * @param student the student's username.
 * @param csvData the student's STAR data.
 */
export function processStudentStarCsvData(advisor, student, csvData) {
  const definitions = processStarCsvData(student, csvData);
  const studentID = Users.findDoc({ username: student })._id;
  const oldInstances = CourseInstances.find({ studentID, fromSTAR: true }).fetch();
  _.map(oldInstances, (instance) => {
    CourseInstances.removeIt(instance._id);
  });
  let numInterstingCourses = 0;
  // let numOtherCourses = 0;
  // console.log('create new instances');
  const departments = {};
  _.map(definitions, (definition) => {
    const semesterID = Semesters.findIdBySlug(definition.semester);
    // console.log('semesterID', semesterID);
    if (definition.course !== Courses.unInterestingSlug) {
      const department = getDepartment(definition.course);
      if (!(department in departments)) {
        departments[department] = 1;
      } else {
        departments[department] += 1;
      }
      numInterstingCourses += 1;
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
    if (definition.course !== Courses.unInterestingSlug) {
      CourseInstances.define(definition);
    }
  });
  let text = 'Uploaded ';
  for (const key in departments) {  // eslint-disable-line
    if (departments.hasOwnProperty(key)) {  // eslint-disable-line
      text = `${text} ${departments[key]} ${key}, `;
    }
  }
  text = text.substring(0, text.length - 2);
  if (numInterstingCourses > 1) {
    text = `${text} courses from STAR.`;
  } else {
    text = `${text} course from STAR.`;
  }
  AdvisorLogs.define({ advisor, student, text });
}

// TODO make this a ValidatedMethod.
Meteor.methods({
  'StarProcessor.loadStarCsvData': function process(a, s, c) {
    check(a, String);
    check(s, String);
    check(c, String);
    processStudentStarCsvData(a, s, c);
  },
});


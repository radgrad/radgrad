import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { Feeds } from '../feed/FeedCollection';
import { Semesters } from '../semester/SemesterCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { Users } from '../user/UserCollection';
import { advisorLogsDefineMethod } from '../log/AdvisorLogCollection.methods';
import { defineMethod } from '../base/BaseCollection.methods';
import { getDepartment } from '../course/CourseUtilities';
import {
  processStarCsvData,
  processStarJsonData,
  processBulkStarCsvData,
  processBulkStarJsonData,
} from './StarProcessor';
import { updateStudentLevel } from '../level/LevelProcessor';

function processStudentStarDefinitions(advisor, student, definitions) {
  // console.log(`processStudentStarDefinitions(${advisor}, ${student}, ${definitions})`);
  console.log(`Processing ${student}'s STAR data`);
  // console.log(definitions);
  const studentID = Users.getID(student);
  // console.log(student, studentID);
  const oldInstances = CourseInstances.find({ studentID, fromSTAR: true }).fetch();
  _.forEach(oldInstances, (instance) => {
    CourseInstances.removeIt(instance._id);
  });
  let numInterstingCourses = 0;
  // let numOtherCourses = 0;
  // console.log('create new instances');
  const departments = {};
  _.forEach(definitions, (definition) => {
    // console.log('semesterID', semesterID);
    // console.log(definition);
    if (definition.course !== Courses.unInterestingSlug) {
      const semesterID = Semesters.findIdBySlug(definition.semester);
      const department = getDepartment(definition.course);
      if (!(department in departments)) {
        departments[department] = 1;
      } else {
        departments[department] += 1;
      }
      numInterstingCourses += 1;
      const courseID = Courses.findIdBySlug(definition.course);
      // console.log('courseID', courseID);
      const planning = CourseInstances.find({ studentID, semesterID, courseID, verified: false }).fetch();
      // console.log('planning', planning);
      if (planning.length > 0) {
        CourseInstances.removeIt(planning[0]._id);
      }
    } else {
      // numOtherCourses += 1;
    }
    definition.fromSTAR = true; // eslint-disable-line
    if (definition.grade === '***' || definition.grade === 'TBD') {
      definition.grade = 'B';  // eslint-disable-line
      definition.verified = false; // eslint-disable-line
    }
    if (definition.course !== Courses.unInterestingSlug) {
      // console.log('CourseInstances.define', definition);
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
  console.log(`${student} had ${numInterstingCourses} course(s)`);
  advisorLogsDefineMethod.call({ advisor, student, text }, (error) => {
    if (error) {
      console.log('Error creating AdvisorLog', error);
    }
  });
}

/**
 * Processes the student's star data creating CourseInstances.
 * @param advisor the advisor's username.
 * @param student the student's username.
 * @param csvData the student's STAR data.
 * @memberOf api/star
 */
function processStudentStarCsvData(advisor, student, csvData) {
  // console.log('processStudentStarCsvData', student, csvData);
  const definitions = processStarCsvData(student, csvData);
  processStudentStarDefinitions(advisor, student, definitions);
}

/**
 * Processes the student's star json data creating CourseInstances.
 * @param advisor the advisor's username.
 * @param student the student's username.
 * @param jsonData the student's STAR data as JSON object.
 * @memberOf api/star
 */
function processStudentStarJsonData(advisor, student, jsonData) {
  const defintions = processStarJsonData(student, jsonData);
  processStudentStarDefinitions(advisor, student, defintions);
}

/**
 * ValidatedMethod for loading student STAR data.
 * @memberOf api/star
 */
export const starLoadDataMethod = new ValidatedMethod({
  name: 'StarProcessor.loadStarCsvData',
  validate: null,
  run(data) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Star data.');
    }
    processStudentStarCsvData(data.advisor, data.student, data.csvData);
  },
});

/**
 * ValidatedMethod for loading student STAR JSON data.
 * @memberOf api/star
 */
export const starLoadJsonDataMethod = new ValidatedMethod({
  name: 'StarProcessor.loadStarJsonData',
  validate: null,
  run(data) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Star data.');
    }
    processStudentStarJsonData(data.advisor, data.student, data.jsonData);
  },
});

function processBulkStarDefinitions(advisor, definitions) {
  let updateNum = 0;
  let newStudents = 0;
  // console.log(definitions);
  if (definitions) {
    const students = Object.keys(definitions);
    _.forEach(students, (student) => {
      if (Users.isDefined(student)) {
        updateNum += 1;
        processStudentStarDefinitions(advisor, student, definitions[student].courses);
        const studentID = Users.getID(student);
        updateStudentLevel(advisor, studentID);
      } else {
        console.log(`${student} is not defined need to create them.`);
        try {
          const definitionData = {};
          definitionData.username = student;
          definitionData.firstName = definitions[student].firstName;
          definitionData.lastName = definitions[student].lastName;
          definitionData.level = 1;
          StudentProfiles.define(definitionData);
          const feedData = { feedType: Feeds.NEW_USER, user: definitionData.username };
          defineMethod.call({ collectionName: Feeds.getCollectionName(), definitionData: feedData });
          processStudentStarDefinitions(advisor, student, definitions[student].courses);
          const studentID = Users.getID(student);
          updateStudentLevel(advisor, studentID);
          newStudents += 1;
        } catch (e) {
          console.log(`Error defining student ${student}`, e);
        }
      }
    });
  }
  return `Updated ${updateNum} student(s), Created ${newStudents} new student(s)`;
}

/**
 * Processes the bulk star data creating CourseInstances.
 * @param advisor the advisor's username.
 * @param csvData the student's STAR data.
 * @memberOf api/star
 */
function processBulkStarData(advisor, csvData) {
  const definitions = processBulkStarCsvData(csvData);
  return processBulkStarDefinitions(advisor, definitions);
}

/**
 * Processes the bulk star data creating CourseInstances.
 * @param advisor the advisor's username.
 * @param jsonData the student's STAR JSON data.
 * @memberOf api/star
 */
function processBulkStarDataJson(advisor, jsonData) {
  // console.log(`processBulkStarDataJson(${advisor}`, jsonData);
  const definitions = processBulkStarJsonData(jsonData);
  // console.log(definitions);
  return processBulkStarDefinitions(advisor, definitions);
}

/**
 * ValidatedMethod for loading bulk STAR data.
 * @memberOf api/star
 */
export const starBulkLoadDataMethod = new ValidatedMethod({
  name: 'StarProcess.bulkLoadStarCsvData',
  validate: null,
  run(data) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Star data.');
    }
    return processBulkStarData(data.advisor, data.csvData);
  },
});

export const starBulkLoadJsonDataMethod = new ValidatedMethod({
  name: 'StarProcess.bulkLoadStarJsonData',
  validate: null,
  run(data) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to define Star data.');
    }
    return processBulkStarDataJson(data.advisor, data.jsonData);
  },
});


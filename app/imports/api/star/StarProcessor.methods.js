import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { processStarCsvData, processBulkStarCsvData } from './StarProcessor';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { Semesters } from '../semester/SemesterCollection';
import { advisorLogsDefineMethod } from '../log/AdvisorLogCollection.methods';
import { Users } from '../user/UserCollection';
import { getDepartment } from '../course/CourseUtilities';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { updateStudentLevel } from '../level/LevelProcessor';

function processStudentStarDefinitions(advisor, student, definitions) {
  console.log(`processStudentStarDefinitions(${advisor}, ${student}, ${definitions})`);
  // console.log(definitions);
  const studentID = Users.getID(student);
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
  advisorLogsDefineMethod.call({ advisor, student, text }, (error) => {
    if (error) {
      console.log('Error creating AdvisorLog', error);
    }
  });
}
/**
 * Processes the student's star data creating CourseInstances.
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
 * Processes the student's star data creating CourseInstances.
 * @param student the student's username.
 * @param csvData the student's STAR data.
 * @memberOf api/star
 */
function processBulkStarData(advisor, csvData) {
  const definitions = processBulkStarCsvData(csvData);
  // console.log(definitions);
  if (definitions) {
    const students = Object.keys(definitions);
    _.forEach(students, (student) => {
      if (Users.isDefined(student)) {
        processStudentStarDefinitions(advisor, student, definitions[student].courses);
        const studentID = Users.getID(student);
        updateStudentLevel(studentID);
      } else {
        console.log(`${student} is not defined need to create them.`);
        try {
          const definitionData = {};
          definitionData.username = student;
          definitionData.firstName = definitions[student].firstName;
          definitionData.lastName = definitions[student].lastName;
          definitionData.level = 1;
          StudentProfiles.define(definitionData);
          processStudentStarDefinitions(advisor, student, definitions[student].courses);
          const studentID = Users.getID(student);
          updateStudentLevel(studentID);
        } catch (e) {
          console.log(`Error defining student ${student}`, e);
        }
      }
    });
  }
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
    processBulkStarData(data.advisor, data.csvData);
  },
});

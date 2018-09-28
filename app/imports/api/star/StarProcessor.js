import { Meteor } from 'meteor/meteor';
import { Papa } from 'meteor/harrison:papa-parse';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Semesters } from '../semester/SemesterCollection';
import { Courses } from '../course/CourseCollection';
import { Slugs } from '../slug/SlugCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';

/* global isNaN */

/**
 * Given the semester string from STAR (for example, 'Fall 2015 ext'), parses it, defines the corresponding semester,
 * and returns the Semester slug.
 * @param semester The STAR semester string.
 * @returns {String} The RadGrad semester slug.
 * @throws Meteor.Error If parsing fails.
 * @memberOf api/star
 */
function findSemesterSlug(starDataObject) {
  const semester = starDataObject.semester;
  if ((!_.isString(semester)) || (semester.length < 8)) {
    throw new Meteor.Error(`Could not parse semester data: ${JSON.stringify(starDataObject)}`);
  }
  const semesterTokens = semester.split(' ');
  let term;
  switch (semesterTokens[0]) {
    case 'Spring':
      term = Semesters.SPRING;
      break;
    case 'Summer':
      term = Semesters.SUMMER;
      break;
    case 'Sum':
      term = Semesters.SUMMER;
      break;
    case 'Fall':
      term = Semesters.FALL;
      break;
    case 'Winter':
      term = Semesters.FALL; // TODO Not sure it this is right thing to do.
      break;
    default:
      return null;
  }
  let year = parseInt(semesterTokens[1], 10);
  if (isNaN(year)) {
    year = parseInt(semesterTokens[2], 10);
    if (isNaN(year)) {
      return null;
    }
  }
  return Semesters.findSlugByID(Semesters.define({ term, year }));
}

/**
 * Returns the course slug, which is either an ICS course or 'other.
 * @param starDataObject The data object.
 * @returns { String } The slug.
 * @memberOf api/star
 */
function findCourseSlug(starDataObject) {
  let slug = `${starDataObject.name.toLowerCase()}_${starDataObject.number}`;
  if (!Slugs.isSlugForEntity(slug, Courses.getType())) {
    slug = Courses.unInterestingSlug;
  }
  return slug;
}

/**
 * Creates a courseInstance data object from the passed arguments.
 * @param starDataObject STAR data.
 * @returns { Object } An object suitable for passing to CourseInstances.define.
 * @memberOf api/star
 */
function makeCourseInstanceObject(starDataObject) {
  return {
    semester: findSemesterSlug(starDataObject),
    course: findCourseSlug(starDataObject),
    note: `${starDataObject.name} ${starDataObject.number}`,
    verified: true,
    fromSTAR: true,
    creditHrs: starDataObject.credits,
    grade: starDataObject.grade,
    student: starDataObject.student,
  };
}

/**
 * Returns an array of arrays, each containing data that can be made into CourseInstances.
 * @param parsedData The parsedData object returned from Papa.parse.
 * @returns { Array } A new array with extraneous elements deleted.
 * @memberOf api/star
 */
function filterParsedData(parsedData) {
  // First, get the actual data from the Papa results.
  let filteredData = parsedData.data;
  // Remove first element containing headers from data array.
  filteredData = _.drop(filteredData, 1);
  // Remove trailing elements that don't contain data.
  filteredData = _.dropRightWhile(filteredData, (data) => data.length < 5);
  // Remove test scores that appear at top.
  filteredData = _.dropWhile(filteredData, (data) => data[2].startsWith('Test'));
  return filteredData;
}

/**
 * Processes STAR CSV data and returns an array of objects containing CourseInstance fields.
 * @param { String } student The slug of the student corresponding to this STAR data.
 * @param { String } csvData A string containing the contents of a CSV file downloaded from STAR.
 * @returns { Array } A list of objects with fields: semester, course, note, verified, grade, and creditHrs.
 * @memberOf api/star
 */
export function processStarCsvData(student, csvData) {
  if (Papa) {
    const parsedData = Papa.parse(csvData);
    if (parsedData.errors.length !== 0) {
      throw new Meteor.Error(`Error found when parsing STAR data for ${student}: ${parsedData.errors}`);
    }
    const headers = parsedData.data[0];
    // console.log('parsed data', parsedData);
    const semesterIndex = _.findIndex(headers, (str) => str === 'Semester');
    const nameIndex = _.findIndex(headers, (str) => str === 'Course Name');
    const numberIndex = _.findIndex(headers, (str) => str === 'Course Number');
    const creditsIndex = _.findIndex(headers, (str) => str === 'Credits');
    const gradeIndex = _.findIndex(headers, (str) => str === 'Grade');
    const transferGradeIndex = _.findIndex(headers, (str) => str === 'Transfer Grade');
    // const transferCourseNameIndex = _.findIndex(headers, (str) => str === 'Transfer Course Name');
    const transferCourseNumberIndex = _.findIndex(headers, (str) => str === 'Transfer Course Number');
    // const transferCourseDesc = _.findIndex(headers, (str) => str === 'Transfer Course Description');
    if (_.every([semesterIndex, nameIndex, numberIndex, creditsIndex, gradeIndex], (num) => num === -1)) {
      throw new Meteor.Error(`Required CSV header field was not found in ${headers}`);
    }
    const filteredData = filterParsedData(parsedData);

    // filteredData.map((data) => console.log('\n*** START ***\n', data, '\n*** END ***\n'));

    // Create array of objects containing raw data to facilitate error message during processing.
    const dataObjects = _.map(filteredData, (data) => {
      const name = data[nameIndex];
      let grade = data[gradeIndex];
      console.log(`grade ${grade}`);
      if (grade === 'CR' && data[transferGradeIndex] && isNaN(data[transferGradeIndex])) {
        grade = data[transferGradeIndex];
      } else if (grade === 'CR' && data[transferGradeIndex] && !isNaN(data[transferGradeIndex])) {
        // got number assuming it is AP exam score need to determine the type of the exam.
        // const exam = data[transferCourseDesc];
        if (data[transferGradeIndex] > 2) {
          grade = 'B';
        }
      } else if (grade === 'unknown' && data[transferGradeIndex] && isNaN(data[transferGradeIndex])) {
        grade = data[transferGradeIndex];
      } else if (grade.includes('L')) {
        grade = 'C';
      }
      let number = data[numberIndex];
      if (isNaN(number)) {
        number = data[transferCourseNumberIndex];
      }
      const obj = {
        semester: data[semesterIndex],
        name,
        number,
        credits: data[creditsIndex],
        grade,
        student,
      };
      return obj;
    });
    // console.log(dataObjects);
    // Now we take that array of objects and transform them into CourseInstance data objects.
    return _.filter(_.map(dataObjects, (dataObject) => makeCourseInstanceObject(dataObject)), function removeOther(ci) {
      return ci.course !== Courses.unInterestingSlug && ci.semester !== null;
    });
  }
  // must be on the client.
  return null;
}

export function processBulkStarCsvData(csvData) {
  if (Papa) {
    const parsedData = Papa.parse(csvData);
    if (parsedData.errors.length !== 0) {
      throw new Meteor.Error(`Error found when parsing STAR data for ${parsedData.errors}`);
    }
    const headers = parsedData.data[0];
    // console.log('parsed data', parsedData);
    const semesterIndex = _.findIndex(headers, (str) => str === 'Semester');
    const nameIndex = _.findIndex(headers, (str) => str === 'Course Name');
    const numberIndex = _.findIndex(headers, (str) => str === 'Course Number');
    const creditsIndex = _.findIndex(headers, (str) => str === 'Credits');
    const gradeIndex = _.findIndex(headers, (str) => str === 'Grade');
    const transferGradeIndex = _.findIndex(headers, (str) => str === 'Transfer Grade');
    // const transferCourseNameIndex = _.findIndex(headers, (str) => str === 'Transfer Course Name');
    const transferCourseNumberIndex = _.findIndex(headers, (str) => str === 'Transfer Course Number');
    // const transferCourseDesc = _.findIndex(headers, (str) => str === 'Transfer Course Description');
    const emailIndex = _.findIndex(headers, (str) => str === 'Email');
    const firstNameIndex = _.findIndex(headers, (str) => str === 'First Name');
    const lastNameIndex = _.findIndex(headers, (str) => str === 'Last Name');
    if (_.every([semesterIndex, nameIndex, numberIndex, creditsIndex, gradeIndex, emailIndex, firstNameIndex, lastNameIndex], (num) => num === -1)) { // eslint-disable-line
      throw new Meteor.Error(`Required CSV header field was not found in ${headers}`);
    }
    const filteredData = filterParsedData(parsedData);
    // Create array of objects containing raw data to facilitate error message during processing.
    const bulkData = {};
    // const dataObjects = _.map(filteredData, (data) => {
    _.forEach(filteredData, (data) => {
      const name = data[nameIndex];
      let grade = data[gradeIndex];
      console.log(`grade ${grade}`);
      if (grade === 'CR' && data[transferGradeIndex] && isNaN(data[transferGradeIndex])) {
        grade = data[transferGradeIndex];
      } else if (grade === 'CR' && data[transferGradeIndex] && !isNaN(data[transferGradeIndex])) {
        // got number assuming it is AP exam score need to determine the type of the exam.
        // const exam = data[transferCourseDesc];
        if (data[transferGradeIndex] > 2) {
          grade = 'B';
        }
      } else if (grade === 'unknown' && data[transferGradeIndex] && isNaN(data[transferGradeIndex])) {
        grade = data[transferGradeIndex];
      } else if (grade.includes('L')) {
        grade = 'C';
      }
      let number = data[numberIndex];
      if (isNaN(number)) {
        number = data[transferCourseNumberIndex];
      }
      const student = data[emailIndex];
      const obj = {
        semester: data[semesterIndex],
        name,
        number,
        credits: data[creditsIndex],
        grade,
        student,
      };
      if (!bulkData[student]) {
        bulkData[student] = {};
        bulkData[student].courses = [];
        bulkData[student].firstName = data[firstNameIndex];
        bulkData[student].lastName = data[lastNameIndex];
      }
      bulkData[student].courses.push(obj);
    });
    // Now we take that array of objects and transform them into CourseInstance data objects.
    _.forEach(Object.keys(bulkData), (key) => {
      bulkData[key].courses = _.filter(_.map(bulkData[key].courses, (dataObject) => makeCourseInstanceObject(dataObject)), function removeOther(ci) { // eslint-disable-line
        return ci.course !== Courses.unInterestingSlug && ci.semester !== null;
      });
    });
    return bulkData;
  }
  return null;
}

/**
 * Processes STAR JSON data and returns an array of objects containing CourseInstance fields.
 * @param { String } student The slug of the student corresponding to this STAR data.
 * @param { String } jsonData JSON object for a student.
 * @returns { Array } A list of objects with fields: semester, course, note, verified, grade, and creditHrs.
 * @memberOf api/star
 */
export function processStarJsonData(student, jsonData) {
  if (student !== jsonData.email) {
    throw new Meteor.Error(`JSON data is not for ${student}`);
  }
  const courses = jsonData.courses;
  const dataObjects = _.map(courses, (course) => {
    const name = course.name;
    let grade = course.grade;
    if (_.includes(CourseInstances.validGrades, grade)) {
      if (grade === 'CR' && course.transferGrade && isNaN(course.transferGrade)) {
        grade = course.transferGrade;
      } else if (grade === 'CR' && course.transferGrade && !isNaN(course.transferGrade)) {
        // got number assuming it is AP exam score need to determine the type of the exam.
        if (course.transferGrade > 2) {
          grade = 'B';
        }
      }
    } else {
      grade = 'OTHER';
    }
    let number = course.number;
    if (isNaN(number)) {
      number = course.transferNumber;
    }
    const obj = {
      semester: course.semester,
      name,
      number,
      credits: course.credits,
      grade,
      student,
    };
    return obj;
  });

  // console.log('single', dataObjects);
  // Now we take that array of objects and transform them into CourseInstance data objects.
  return _.filter(_.map(dataObjects, (dataObject) => makeCourseInstanceObject(dataObject)), function removeOther(ci) {
    return ci.course !== Courses.unInterestingSlug && ci.semester !== null;
  });
}

/**
 * Processes STAR JSON data and returns an array of objects containing CourseInstance fields.
 * @param { String } jsonData JSON array with objects for students.
 * @returns { Array } A list of objects with fields: semester, course, note, verified, grade, and creditHrs.
 * @memberOf api/star
 */
export function processBulkStarJsonData(jsonData) {
  const bulkData = {};
  _.forEach(jsonData, (data) => {
    // console.log(data);
    const student = data.email;
    if (!bulkData[student]) {
      bulkData[student] = {};
      bulkData[student].courses = processStarJsonData(student, data);
      bulkData[student].firstName = data.name.first;
      bulkData[student].lastName = data.name.last;
    }
  });
  // console.log('bulk', bulkData);
  return bulkData;
}

/* global isNaN */
import { Meteor } from 'meteor/meteor';
import { Papa } from 'meteor/harrison:papa-parse';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Courses } from '/imports/api/course/CourseCollection';
import { Slugs } from '/imports/api/slug/SlugCollection';


/** @module StarProcessor */

/**
 * Given the semester string from STAR (for example, 'Fall 2015 ext'), parses it, defines the corresponding semester,
 * and returns the Semester slug.
 * @param semester The STAR semester string.
 * @returns {String} The RadGrad semester slug.
 * @throws Meteor.Error If parsing fails.
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
    default:
      throw new Meteor.Error(`Could not parse semester data: ${JSON.stringify(starDataObject)}`);
  }
  let year = parseInt(semesterTokens[1], 10);
  if (isNaN(year)) {
    year = parseInt(semesterTokens[2], 10);
    if (isNaN(year)) {
      throw new Meteor.Error(`Could not parse semester data: ${JSON.stringify(starDataObject)}`);
    }
  }
  return Semesters.findSlugByID(Semesters.define({ term, year }));
}

/**
 * Returns the course slug, which is either an ICS course or 'other.
 * @param starDataObject The data object.
 * @returns { String } The slug.
 */
function findCourseSlug(starDataObject) {
  let slug = starDataObject.name.toLowerCase() + starDataObject.number;
  if (!Slugs.isSlugForEntity(slug, Courses.getType())) {
    // TODO: hardwiring 'other' into the code is brittle.
    slug = 'other';
  }
  return slug;
}

/**
 * Creates a courseInstance data object from the passed arguments.
 * @param starDataObject STAR data.
 * @returns { Object } An object suitable for passing to CourseInstances.define.
 */
function makeCourseInstanceObject(starDataObject) {
  return {
    semester: findSemesterSlug(starDataObject),
    course: findCourseSlug(starDataObject),
    note: `${starDataObject.name} ${starDataObject.number}`,
    verified: true,
    creditHrs: starDataObject.credits,
    grade: starDataObject.grade,
    student: starDataObject.student,
  };
}

/**
 * Returns an array of arrays, each containing data that can be made into CourseInstances.
 * @param parsedData The parsedData object returned from Papa.parse.
 * @returns { Array } A new array with extraneous elements deleted.
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
      if (name === 'ICS' && grade === 'CR' && data[transferGradeIndex] && isNaN(data[transferGradeIndex])) {
        grade = data[transferGradeIndex];
      } else if (name === 'ICS' && grade === 'CR' && data[transferGradeIndex] && !isNaN(data[transferGradeIndex])) {
        // got number assuming it is AP exam score need to determine the type of the exam.
        // const exam = data[transferCourseDesc];
        if (data[transferGradeIndex] > 2) {
          grade = 'B';
        }
      }
      const obj = {
        semester: data[semesterIndex],
        name,
        number: data[numberIndex],
        credits: data[creditsIndex],
        grade,
        student,
      };
      return obj;
    });
    // Now we take that array of objects and transform them into CourseInstance data objects.
    return _.map(dataObjects, (dataObject) => makeCourseInstanceObject(dataObject));
  }
  // must be on the client.
  return null;
}

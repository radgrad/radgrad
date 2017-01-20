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

Meteor.methods({
  'StarProcessor.loadStarCsvData': function process(student, csvData) {
    // console.log(`loadStarCsvData ${student} ${csvData}`);
    check(student, String);
    check(csvData, String);
    const definitions = processStarCsvData(student, csvData);
    // console.log('definitions', definitions);
    const studentID = Users.findDoc({ username: student })._id;
    const oldInstances = CourseInstances.find({ studentID, verified: true }).fetch();
    // console.log('oldInstances', oldInstances);
    _.map(oldInstances, (instance) => {
      CourseInstances.removeIt(instance._id);
    });
    let numIcsCourses = 0;
    let numOtherCourses = 0;
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
        numOtherCourses += 1;
      }
      // console.log('CourseInstances.define', definition);
      CourseInstances.define(definition);
      const split = definition.semester.split('-');
      let yearVal = parseInt(split[1], 10);
      if (split[0] !== 'Fall') {
        yearVal -= 1;
      }
      // console.log('AcademicYearInstances.define', student, yearVal);
      return AcademicYearInstances.define({ student, year: yearVal });
    });
    const note = `Uploaded ${numIcsCourses} ICS courses and ${numOtherCourses} other courses.`;
    StarDataLogs.define({ student, note });
  },
});


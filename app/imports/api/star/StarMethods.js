/**
 * Created by Cam on 12/16/2016.
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { processStarCsvData } from './StarProcessor';
import { AcademicYearInstances } from '../year/AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Users } from '../user/UserCollection';

Meteor.methods({
  'StarProcessor.loadStarCsvData': function process(student, csvData) {
    console.log('loadStarCsvData');
    check(student, String);
    check(csvData, String);
    const definitions = processStarCsvData(student, csvData);
    console.log(definitions);
    const studentID = Users.findDoc({ username: student })._id;
    const oldInstances = CourseInstances.find({ studentID, verified: true }).fetch();
    console.log(oldInstances);
    oldInstances.forEach((instance) => {
      CourseInstances.removeIt(instance._id);
    });
    definitions.forEach((definition) => {
      console.log(`defining ${definition}`);
      const semesterID = Semesters.findIdBySlug(definition.semester);
      console.log(semesterID);
      if (definition.course !== 'other') {
        const courseID = Courses.findIdBySlug(definition.course);
        const planning = CourseInstances.findDoc({ semesterID, courseID, verified: false });
        console.log(`replacing ${planning}`);
        if (planning) {
          CourseInstances.removeIt(planning._id);
        }
      }
      CourseInstances.define(definition);
      const split = definition.semester.split('-');
      let yearVal = parseInt(split[1], 10);
      if (split[0] !== 'Fall') {
        yearVal -= 1;
      }
      console.log(`Defining AcademicYear ${yearVal}`);
      return AcademicYearInstances.define({ student, year: yearVal });
    });
  },
});


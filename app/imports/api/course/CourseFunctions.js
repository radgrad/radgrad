import { Meteor } from 'meteor/meteor';
import { lodash } from 'meteor/erasaur:meteor-lodash';

import { CourseInstances } from './CourseInstanceCollection.js';
import { Courses } from './CourseCollection.js';
import { Semesters } from '../semester/SemesterCollection.js';
import { Slugs } from '../slug/SlugCollection';

/**
 * Checks all the CourseInstances to ensure that the prerequisites are fulfilled.
 */
export const checkPrerequisites = () => {
  const cis = CourseInstances.find({ studentID: Meteor.userId() }).fetch();
  cis.forEach((ci) => {
    const semester = Semesters.findDoc(ci.semesterID);
    const course = Courses.findDoc(ci.courseID);
    if (course) {
      const prereqs = course.prerequisites;
      prereqs.forEach((p) => {
        const courseSlug = Slugs.getEntityID(p, 'Course');
        const preCiIndex = lodash.findIndex(cis, function find(obj) {
          return obj.courseID === courseSlug;
        });
        if (preCiIndex !== -1) {
          const preCi = cis[preCiIndex];
          const preCourse = Courses.findDoc(preCi.courseID);
          const preSemester = Semesters.findDoc(preCi.semesterID);
          if (preSemester) {
            if (preSemester.sortBy >= semester.sortBy) {
              console.log(`${course.number}'s prerequisite ${preCourse.number} is after or in same semester.`);
            }
          } else {
            console.log(`Couldn't find the semester for ${preCi.semesterID}`);
          }
        } else {
          console.log(`Prerequisite for ${course.number} not found.`);
        }
      });
    }
  });
};

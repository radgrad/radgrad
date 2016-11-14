import { Meteor } from 'meteor/meteor';
import { lodash } from 'meteor/erasaur:meteor-lodash';

import { CourseInstances } from './CourseInstanceCollection.js';
import { Courses } from './CourseCollection.js';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection.js';
import { Feedbacks } from '../feedback/FeedbackCollection.js';
import { Semesters } from '../semester/SemesterCollection.js';
import { Slugs } from '../slug/SlugCollection';

const area = 'DegreePlanPrerequisites';

const clearFeedbackInstances = () => {
  const userID = Meteor.userId();
  const instances = FeedbackInstances.find({ userID, area }).fetch();
  instances.forEach((i) => {
    FeedbackInstances.removeIt(i._id);
  });
};

/**
 * Checks all the CourseInstances to ensure that the prerequisites are fulfilled.
 */
export const checkPrerequisites = () => {
  const f = Feedbacks.find({ name: 'Prerequisite missing' }).fetch()[0];
  const feedback = Slugs.getEntityID(f.slugID, 'Feedback');
  clearFeedbackInstances();
  const cis = CourseInstances.find({ studentID: Meteor.userId() }).fetch();
  cis.forEach((ci) => {
    const semester = Semesters.findDoc(ci.semesterID);
    const semesterName = Semesters.toString(ci.semesterID, false);
    const course = Courses.findDoc(ci.courseID);
    if (course) {
      const prereqs = course.prerequisites;
      prereqs.forEach((p) => {
        const courseID = Slugs.getEntityID(p, 'Course');
        const prerequisiteCourse = Courses.find({ _id: courseID }).fetch()[0];
        const preCiIndex = lodash.findIndex(cis, function find(obj) {
          return obj.courseID === courseID;
        });
        if (preCiIndex !== -1) {
          const preCi = cis[preCiIndex];
          const preCourse = Courses.findDoc(preCi.courseID);
          const preSemester = Semesters.findDoc(preCi.semesterID);
          if (preSemester) {
            if (preSemester.sortBy >= semester.sortBy) {
              const semesterName2 = Semesters.toString(preSemester._id, false);
              const description = `${semesterName}: ${course.number}'s prerequisite ${preCourse.number} is after or in ${semesterName2}.`;
              FeedbackInstances.define({ feedback, user: Meteor.user().username, description, area });
            }
          } else {
            console.log(`Couldn't find the semester for ${preCi.semesterID}`);
          }
        } else {
          const description = `${semesterName}: Prerequisite ${prerequisiteCourse.number} for ${course.number} not found.`;
          FeedbackInstances.define({ feedback, user: Meteor.user().username, description, area });
        }
      });
    }
  });
};


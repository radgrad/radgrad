import { lodash } from 'meteor/erasaur:meteor-lodash';

import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection.js';
import { Feedbacks } from '../../../api/feedback/FeedbackCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getRouteUserName } from '../shared/route-user-name';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

const area = 'DegreePlanPrerequisites';

const clearFeedbackInstances = () => {
  const userID = getUserIdFromRoute();
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
  const cis = CourseInstances.find({ studentID: getUserIdFromRoute() }).fetch();
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
              const description = `${semesterName}: ${course.number}'s prerequisite ${preCourse.number} is after or` +
              ` in ${semesterName2}.`;
              FeedbackInstances.define({
                feedback,
                user: getRouteUserName(),
                description,
                area,
              });
            }
          }
        } else {
          const description = `${semesterName}: Prerequisite ${prerequisiteCourse.number} for ${course.number}` +
              ' not found.';
          FeedbackInstances.define({
            feedback,
            user: getRouteUserName(),
            description,
            area,
          });
        }
      });
    }
  });
};


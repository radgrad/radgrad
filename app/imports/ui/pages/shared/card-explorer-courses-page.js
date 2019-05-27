import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';

import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { ROLE } from '../../../api/role/Role';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

Template.Card_Explorer_Courses_Page.helpers({
  addedCourses() {
    let addedCourses = [];
    const allCourses = Courses.findNonRetired({}, { sort: { shortName: 1 } });
    const userID = getUserIdFromRoute();
    _.forEach(allCourses, (course) => {
      const ci = CourseInstances.find({
        studentID: userID,
        courseID: course._id,
      }).fetch();
      if (ci.length > 0) {
        if (course.shortName !== 'Non-CS Course') {
          addedCourses.push({ item: course, count: ci.length });
        }
      }
    });
    if (Roles.userIsInRole(userID, [ROLE.STUDENT])) {
      const profile = StudentProfiles.findDoc({ userID });
      const plan = AcademicPlans.findDoc(profile.academicPlanID);
      // CAM: why are we filtering?
      if (plan.coursesPerSemester.length < 15) { // not bachelors and masters
        const regex = /[1234]\d\d/g;
        addedCourses = _.filter(addedCourses, (c) => c.item.number.match(regex));
      }
    }
    console.log('addedCourses %o', addedCourses);
    return addedCourses;
  },
  nonAddedCourses() {
    const allCourses = Courses.findNonRetired({}, { sort: { shortName: 1 } });
    const userID = getUserIdFromRoute();
    const nonAddedCourses = _.filter(allCourses, function (course) {
      const ci = CourseInstances.find({
        studentID: userID,
        courseID: course._id,
      }).fetch();
      if (ci.length > 0) {
        return false;
      }
      if (course.shortName === 'Non-CS Course') {
        return false;
      }
      return true;
    });
    return nonAddedCourses;
  },
});

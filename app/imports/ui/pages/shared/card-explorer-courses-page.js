import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';

import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { ROLE } from '../../../api/role/Role';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';

Template.Card_Explorer_Courses_Page.helpers({
  addedCourses() {
    let addedCourses = [];
    const studentID = getUserIdFromRoute();
    const favorites = FavoriteCourses.find({ studentID }).fetch();
    return _.map(favorites, (f) => ({ item: Courses.findDoc(f.courseID), count: 1 }));
  },
  nonAddedCourses() {
    const allCourses = Courses.findNonRetired({}, { sort: { shortName: 1 } });
    const studentID = getUserIdFromRoute();
    const favoriteIDs = _.map(FavoriteCourses.find({ studentID }).fetch(), (f) => f.courseID);

    const nonAddedCourses = _.filter(allCourses, function (course) {
      return !_.includes(favoriteIDs, course._id);
    });
    console.log(nonAddedCourses);
    return nonAddedCourses;
  },
});

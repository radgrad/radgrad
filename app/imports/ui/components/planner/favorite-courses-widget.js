import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { Courses } from '../../../api/course/CourseCollection';

Template.Favorite_Courses_Widget.helpers({
  courseExplorerRouteName() {
    return RouteNames.studentCardExplorerCoursesPageRouteName;
  },
  getCourses() {
    const studentID = getUserIdFromRoute();
    const favorites = FavoriteCourses.findNonRetired({ studentID });
    // console.log(favorites);
    return _.map(favorites, (f) => Courses.findDoc(f.courseID));
  },
});

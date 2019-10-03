import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Courses } from '../../../api/course/CourseCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';
import { ROLE } from '../../../api/role/Role';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';

export const courseFilterKeys = {
  none: 'none',
  threeHundredPLus: '300+',
  fourHundredPlus: '400+',
  sixHundredPlus: '600+',
};

Template.Card_Explorer_Courses_Widget.onCreated(function cardExplorerCoursesWidgetOnCreated() {
  this.filter = new ReactiveVar(courseFilterKeys.none);
});

const availableCourses = () => {
  const courses = Courses.findNonRetired({});
  const studentID = getUserIdFromRoute();
  let favorites = FavoriteCourses.findNonRetired({ studentID });
  const favoriteIDs = _.map(favorites, (f) => f.courseID);
  let filtered = _.filter(courses, function filter(course) {
    return !_.includes(favoriteIDs, course._id);
  });
  if (Roles.userIsInRole(studentID, [ROLE.STUDENT])) {
    favorites = FavoriteAcademicPlans.findNonRetired({ studentID });
    // console.log(favorites);
    let isGraduate = false;
    _.forEach(favorites, (f) => {
      const grad = AcademicPlans.isGraduatePlan(f.academicPlanID);
      isGraduate = isGraduate || grad;
    });
    if (!isGraduate) { // not bachelors and masters
      const regex = /[1234]\d\d/g;
      filtered = _.filter(filtered, (c) => c.number.match(regex));
    }
  }
  return filtered;
};

function matchingCourses() {
  if (getRouteUserName()) {
    const allCourses = availableCourses();
    const profile = Users.getProfile(getRouteUserName());
    const interestIDs = Users.getInterestIDs(profile.userID);
    const preferred = new PreferredChoice(allCourses, interestIDs);
    return preferred.getOrderedChoices();
  }
  return [];
}

Template.Card_Explorer_Courses_Widget.helpers({
  courses() {
    const courses = matchingCourses();
    let visibleCourses = courses;
    switch (Template.instance().filter.get()) {
      case courseFilterKeys.threeHundredPLus:
        visibleCourses = _.filter(visibleCourses, (c) => {
          const num = parseInt(c.number.split(' ')[1], 10);
          return num >= 300;
        });
        break;
      case courseFilterKeys.fourHundredPlus:
        visibleCourses = _.filter(visibleCourses, (c) => {
          const num = parseInt(c.number.split(' ')[1], 10);
          return num >= 400;
        });
        break;
      case courseFilterKeys.sixHundredPlus:
        visibleCourses = _.filter(visibleCourses, (c) => {
          const num = parseInt(c.number.split(' ')[1], 10);
          return num >= 600;
        });
        break;
      default:
        // do nothing.
    }
    return visibleCourses;
  },
  courseFilter() {
    return Template.instance().filter;
  },
  itemCount() {
    return Template.instance().view.template.__helpers[' courses']().length;
  },
  noInterests() {
    if (getRouteUserName()) {
      const studentID = getUserIdFromRoute();
      const favoriteInterest = FavoriteInterests.findNonRetired({ studentID });
      const favoriteCareerGoals = FavoriteCareerGoals.findNonRetired({ studentID });
      return favoriteInterest.length === 0 && favoriteCareerGoals.length === 0;
    }
    return true;
  },
});

Template.Card_Explorer_Courses_Widget.onRendered(function cardExplorerCoursesWidgetOnRendered() {
  if (getUserIdFromRoute()) {
    const profile = Users.getProfile(getUserIdFromRoute());
    // console.log(profile);
    if (profile.courseExplorerFilter) {
      Template.instance()
        .filter
        .set(profile.courseExplorerFilter);
    }
  }
});

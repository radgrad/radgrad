import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '../../startup/client/router.js';
import { Semesters } from '../../api/semester/SemesterCollection';
import { Users } from '../../api/user/UserCollection.js';

/**
 * Returns the explorerUserName portion of the route.
 */
export function getExplorerUserID() {
  const username = FlowRouter.getParam('explorerUserName');
  return Users.findDoc({ username })._id;
}

/**
 * Returns the difference of two timestamps in days.
 * @param a timestamp.
 * @param b timestamp.
 * @return {number}
 */
export function dateDiffInDays(a, b) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((a - b) / MS_PER_DAY);
}

export function opportunitySemesters(opp) {
  const semesterIDs = opp.semesterIDs;
  const upcomingSemesters = _.filter(semesterIDs, semesterID => Semesters.isUpcomingSemester(semesterID));
  return _.map(upcomingSemesters, semesterID => Semesters.toString(semesterID));
}

/* Route Name Helpers */

export function coursesRouteName() {
  return RouteNames.studentExplorerCoursesPageRouteName;
}

export function opportunitiesRouteName() {
  return RouteNames.studentExplorerOpportunitiesPageRouteName;
}

export function usersRouteName() {
  return RouteNames.studentExplorerUsersPageRouteName;
}

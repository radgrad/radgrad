import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Semesters } from '../../api/semester/SemesterCollection';
import { Users } from '../../api/user/UserCollection.js';
import { getGroupName } from '../components/shared/route-group-name';

/**
 * Returns the explorerUserName portion of the route.
 * @memberOf ui/utilities
 */
export function getExplorerUserID() {
  const username = FlowRouter.getParam('explorerUserName') &&
      FlowRouter.getParam('explorerUserName').replace('%2540', '@');
  return username && Users.getID(username);
}

/**
 * Returns the difference of two timestamps in days.
 * @param a timestamp.
 * @param b timestamp.
 * @return {number}
 * @memberOf ui/utilities
 */
export function dateDiffInDays(a, b) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((a - b) / MS_PER_DAY);
}

/**
 * Returns an array of strings naming the upcoming semesters associated with the passed opportunity instance.
 * @param opportunityInstance The opportunity instance
 * @returns { Array } An array of semester strings.
 * @memberOf ui/utilities
 */
export function opportunitySemesters(opportunityInstance) {
  const semesterIDs = opportunityInstance.semesterIDs;
  const upcomingSemesters = _.filter(semesterIDs, semesterID => Semesters.isUpcomingSemester(semesterID));
  return _.map(upcomingSemesters, semesterID => Semesters.toString(semesterID));
}

/**
 * Returns true if the current user (i.e. from the URL, not necessarily Meteor.user) has the specified role.
 * @param role The role of interest.
 * @returns {boolean} True if the user has that role.
 * @memberOf ui/utilities
 */
export function isInRole(role) {
  const group = getGroupName();
  return group === role;
}

/**
 * True if label is equal to value.
 * (Why is this a thing?)
 * @memberOf ui/utilities
 */
export function isLabel(label, value) {
  return label === value;
}

/**
 * Two global helpers to allow logical conditions in templates. For example:
 *
 * {{#if and a b}}
 *   a and b are both truthy
 * {{/if}}
 *
 * {{#if or a b}}
 *   a or b is truthy
 * {{/if}}
 *
 * Adapted from: https://stackoverflow.com/questions/36499595/blaze-logic-not-or-and-in-if-statement
 * @memberOf ui/utilities
 */
Template.registerHelper('and', (a, b) => a && b);
Template.registerHelper('or', (a, b) => a || b);

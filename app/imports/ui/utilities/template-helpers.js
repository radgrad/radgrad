import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Semesters } from '../../api/semester/SemesterCollection';
import { Users } from '../../api/user/UserCollection.js';

/**
 * Returns the explorerUserName portion of the route.
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

export function isInRole(role) {
  const group = FlowRouter.current().route.group.name;
  return group === role;
}

export function isLabel(label, value) {
  return label === value;
}

/*
 Allow logical conditions in templates. For example:

 {{#if and a b}}
   a and b are both true-ish
 {{/if}}

 {{#if or a b}}
   a or b is true-ish
 {{/if}}
 */
Template.registerHelper('and', (a, b) => a && b);
Template.registerHelper('or', (a, b) => a || b);

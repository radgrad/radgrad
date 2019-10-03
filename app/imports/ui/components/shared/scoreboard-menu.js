import { Template } from 'meteor/templating';

import * as RouteNames from '../../../startup/client/router';
import { getGroupName } from './route-group-name';

Template.Scoreboard_Menu.helpers({
  courseScoreboardRouteName() {
    const group = getGroupName();
    // console.log('group=%o', group);
    if (group === 'admin') {
      return RouteNames.adminCourseScoreboardPageRouteName;
    }
    if (group === 'advisor') {
      return RouteNames.advisorCourseScoreboardPageRouteName;
    }
    if (group === 'faculty') {
      return RouteNames.facultyCourseScoreboardPageRouteName;
    }
    return '';
  },
  opportunityScoreboardRouteName() {
    const group = getGroupName();
    // console.log('group=%o', group);
    if (group === 'admin') {
      return RouteNames.adminOpportunityScoreboardPageRouteName;
    }
    if (group === 'advisor') {
      return RouteNames.advisorOpportunityScoreboardPageRouteName;
    }
    if (group === 'faculty') {
      return RouteNames.facultyOpportunityScoreboardPageRouteName;
    }
    return '';
  },
});

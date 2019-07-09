import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import * as RouteNames from '../../../startup/client/router';

Template.Scoreboard_Menu.helpers({
  courseScoreboardRouteName() {
    const group = FlowRouter.current().route.group.name;
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
    const group = FlowRouter.current().route.group.name;
    console.log('group=%o', group);
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

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Users } from '../../../api/user/UserCollection';
import * as RouteNames from '../../../startup/client/router';

Template.Explorer_Menu.helpers({
  academicPlansCardRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerPlansPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerPlansPageRouteName;
    }
    return RouteNames.mentorExplorerPlansPageRouteName;
  },
  academicPlansRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerPlansPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerPlansPageRouteName;
    }
    return RouteNames.mentorExplorerPlansPageRouteName;
  },
  adminEmail() {
    const admin = Users._adminUsername();
    return admin;
  },
  careerGoalsCardRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerCareerGoalsPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerCareerGoalsPageRouteName;
    }
    return RouteNames.mentorExplorerCareerGoalsPageRouteName;
  },
  careerGoalsRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerCareerGoalsPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerCareerGoalsPageRouteName;
    }
    return RouteNames.mentorExplorerCareerGoalsPageRouteName;
  },
  classType(item, type) {
    let ret = 'item';
    let current;
    if (type === 'course') {
      current = FlowRouter.getParam('course');
    } else
    if (type === 'careerGoal') {
      current = FlowRouter.getParam('careerGoal');
    } else
    if (type === 'degree') {
      current = FlowRouter.getParam('degree');
    } else
    if (type === 'plan') {
      current = FlowRouter.getParam('plan');
    } else
    if (type === 'interest') {
      current = FlowRouter.getParam('interest');
    } else
    if (type === 'opportunity') {
      current = FlowRouter.getParam('opportunity');
    }
    if (item === current) {
      ret = 'active item';
    }
    return ret;
  },
  coursesCardRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerCoursesPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorExplorerCoursesPageRouteName;
  },
  coursesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerCoursesPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorExplorerCoursesPageRouteName;
  },
  degreesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerDegreesPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerDegreesPageRouteName;
    }
    return RouteNames.mentorExplorerDegreesPageRouteName;
  },
});

Template.Explorer_Menu.events({
  // add your events here
});

Template.Explorer_Menu.onRendered(function explorerMenuOnRendered() {
  // add your statement here
});

Template.Explorer_Menu.onDestroyed(function explorerMenuOnDestroyed() {
  // add your statement here
});


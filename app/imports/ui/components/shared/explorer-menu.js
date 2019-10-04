import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Users } from '../../../api/user/UserCollection';
import * as RouteNames from '../../../startup/client/router';
import { isInRole } from '../../utilities/template-helpers';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getRouteUserName } from './route-user-name';
import { getUserIdFromRoute } from './get-user-id-from-route';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { getGroupName } from './route-group-name';

/* global window */

Template.Explorer_Menu.helpers({
  academicPlansCardRouteName() {
    window.camDebugging.start('ExplorerMenu.academicPlansCardRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.academicPlansCardRouteName');
      return RouteNames.studentCardExplorerPlansPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.academicPlansCardRouteName');
      return RouteNames.facultyCardExplorerPlansPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.academicPlansCardRouteName');
    return RouteNames.mentorCardExplorerPlansPageRouteName;
  },
  academicPlansRouteName() {
    window.camDebugging.start('ExplorerMenu.academicPlansRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.academicPlansRouteName');
      return RouteNames.studentExplorerPlansPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.academicPlansRouteName');
      return RouteNames.facultyExplorerPlansPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.academicPlansRouteName');
    return RouteNames.mentorExplorerPlansPageRouteName;
  },
  adminEmail() {
    window.camDebugging.start('ExplorerMenu.adminEmail');
    const admin = Users._adminUsername();
    window.camDebugging.stop('ExplorerMenu.adminEmail');
    return admin;
  },
  careerGoalsCardRouteName() {
    window.camDebugging.start('ExplorerMenu.careerGoalsCardRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.careerGoalsCardRouteName');
      return RouteNames.studentCardExplorerCareerGoalsPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.careerGoalsCardRouteName');
      return RouteNames.facultyCardExplorerCareerGoalsPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.careerGoalsCardRouteName');
    return RouteNames.mentorCardExplorerCareerGoalsPageRouteName;
  },
  careerGoalsRouteName() {
    window.camDebugging.start('ExplorerMenu.careerGoalsRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.careerGoalsRouteName');
      return RouteNames.studentExplorerCareerGoalsPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.careerGoalsRouteName');
      return RouteNames.facultyExplorerCareerGoalsPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.careerGoalsRouteName');
    return RouteNames.mentorExplorerCareerGoalsPageRouteName;
  },
  classType(item, type) {
    window.camDebugging.start('ExplorerMenu.classType');
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
    window.camDebugging.stop('ExplorerMenu.classType');
    return ret;
  },
  courseName(course) {
    window.camDebugging.start('ExplorerMenu.courseName');
    const countStr = `x${course.count}`;
    if (course.count > 1) {
      window.camDebugging.stop('ExplorerMenu.courseName');
      return `${course.item.shortName} ${countStr}`;
    }
    window.camDebugging.stop('ExplorerMenu.courseName');
    return `${course.item.shortName}`;
  },
  coursesCardRouteName() {
    window.camDebugging.start('ExplorerMenu.coursesCardRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.coursesCardRouteName');
      return RouteNames.studentCardExplorerCoursesPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.coursesCardRouteName');
      return RouteNames.facultyCardExplorerCoursesPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.coursesCardRouteName');
    return RouteNames.mentorCardExplorerCoursesPageRouteName;
  },
  coursesRouteName() {
    window.camDebugging.start('ExplorerMenu.coursesRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.coursesRouteName');
      return RouteNames.studentExplorerCoursesPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.coursesRouteName');
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.coursesRouteName');
    return RouteNames.mentorExplorerCoursesPageRouteName;
  },
  degreesCardRouteName() {
    window.camDebugging.start('ExplorerMenu.degreesCardRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.degreesCardRouteName');
      return RouteNames.studentCardExplorerDegreesPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.degreesCardRouteName');
      return RouteNames.facultyCardExplorerDegreesPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.degreesCardRouteName');
    return RouteNames.mentorCardExplorerDegreesPageRouteName;
  },
  degreesRouteName() {
    window.camDebugging.start('ExplorerMenu.academicPlansRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.academicPlansRouteName');
      return RouteNames.studentExplorerDegreesPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.academicPlansRouteName');
      return RouteNames.facultyExplorerDegreesPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.academicPlansRouteName');
    return RouteNames.mentorExplorerDegreesPageRouteName;
  },
  equals(a, b) {
    window.camDebugging.start('ExplorerMenu.equals');
    const listArg = b.split(',');
    if (listArg.indexOf(a) < 0) {
      window.camDebugging.stop('ExplorerMenu.equals');
      return false;
    }
    window.camDebugging.stop('ExplorerMenu.equals');
    return true;
  },
  getRouteName() {
    window.camDebugging.start('ExplorerMenu.getRouteName');
    const routeName = FlowRouter.getRouteName();
    switch (routeName) {
      case RouteNames.studentExplorerCareerGoalsPageRouteName:
      case RouteNames.facultyExplorerCareerGoalsPageRouteName:
      case RouteNames.mentorExplorerCareerGoalsPageRouteName:
        window.camDebugging.stop('ExplorerMenu.getRouteName');
        return 'Career Goals';
      case RouteNames.studentExplorerCoursesPageRouteName:
      case RouteNames.facultyExplorerCoursesPageRouteName:
      case RouteNames.mentorExplorerCoursesPageRouteName:
        window.camDebugging.stop('ExplorerMenu.getRouteName');
        return 'Courses';
      case RouteNames.studentExplorerPlansPageRouteName:
      case RouteNames.facultyExplorerPlansPageRouteName:
      case RouteNames.mentorExplorerPlansPageRouteName:
        window.camDebugging.stop('ExplorerMenu.getRouteName');
        return 'Academic Plans';
      case RouteNames.studentExplorerDegreesPageRouteName:
      case RouteNames.facultyExplorerDegreesPageRouteName:
      case RouteNames.mentorExplorerDegreesPageRouteName:
        window.camDebugging.stop('ExplorerMenu.getRouteName');
        return 'Degrees';
      case RouteNames.studentExplorerInterestsPageRouteName:
      case RouteNames.facultyExplorerInterestsPageRouteName:
      case RouteNames.mentorExplorerInterestsPageRouteName:
        window.camDebugging.stop('ExplorerMenu.getRouteName');
        return 'Interests';
      case RouteNames.studentExplorerOpportunitiesPageRouteName:
      case RouteNames.facultyExplorerOpportunitiesPageRouteName:
      case RouteNames.mentorExplorerOpportunitiesPageRouteName:
        window.camDebugging.stop('ExplorerMenu.getRouteName');
        return 'Opportunities';
      case RouteNames.studentCardExplorerUsersPageRouteName:
      case RouteNames.facultyCardExplorerUsersPageRouteName:
      case RouteNames.mentorCardExplorerUsersPageRouteName:
        window.camDebugging.stop('ExplorerMenu.getRouteName');
        return 'Users';
      default:
        window.camDebugging.stop('ExplorerMenu.getRouteName');
        return 'Select Explorer';
    }
  },
  interestsCardRouteName() {
    window.camDebugging.start('ExplorerMenu.interestsCardRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.interestsCardRouteName');
      return RouteNames.studentCardExplorerInterestsPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.interestsCardRouteName');
      return RouteNames.facultyExplorerInterestsPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.interestsCardRouteName');
    return RouteNames.mentorExplorerInterestsPageRouteName;
  },
  interestsRouteName() {
    window.camDebugging.start('ExplorerMenu.interestsRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.interestsRouteName');
      return RouteNames.studentExplorerInterestsPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.interestsRouteName');
      return RouteNames.facultyExplorerInterestsPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.interestsRouteName');
    return RouteNames.mentorExplorerInterestsPageRouteName;
  },
  isInRole,
  isType(type, value) {
    return type === value;
  },
  itemName(item) {
    window.camDebugging.start('ExplorerMenu.itemName');
    const countStr = `x${item.count}`;
    if (item.count > 1) {
      window.camDebugging.stop('ExplorerMenu.itemName');
      return `${item.item.name} ${countStr}`;
    }
    window.camDebugging.stop('ExplorerMenu.itemName');
    return `${item.item.name}`;
  },
  opportunityItemName(item) {
    window.camDebugging.start('ExplorerMenu.opportunityItemName');
    const countStr = `x${item.count}`;
    const iceString = `(${item.item.ice.i}/${item.item.ice.c}/${item.item.ice.e})`;
    if (item.count > 1) {
      window.camDebugging.stop('ExplorerMenu.opportunityItemName');
      return `${item.item.name} ${iceString} ${countStr}`;
    }
    window.camDebugging.stop('ExplorerMenu.opportunityItemName');
    return `${item.item.name} ${iceString}`;
  },
  opportunitiesCardRouteName() {
    window.camDebugging.start('ExplorerMenu.opportunityCardRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.opportunityCardRouteName');
      return RouteNames.studentExplorerOpportunitiesPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.opportunityCardRouteName');
      return RouteNames.facultyExplorerOpportunitiesPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.opportunityCardRouteName');
    return RouteNames.mentorExplorerOpportunitiesPageRouteName;
  },
  opportunitiesRouteName() {
    window.camDebugging.start('ExplorerMenu.opportunityRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.opportunityRouteName');
      return RouteNames.studentExplorerOpportunitiesPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.opportunityRouteName');
      return RouteNames.facultyExplorerOpportunitiesPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.opportunityRouteName');
    return RouteNames.mentorExplorerOpportunitiesPageRouteName;
  },
  slugName(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  userCareerGoals(careerGoal) {
    window.camDebugging.start('ExplorerMenu.userCareerGoal');
    let ret = '';
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
        ret = 'check green circle outline icon';
      }
      window.camDebugging.stop('ExplorerMenu.userCareerGoal');
    }
    return ret;
  },
  userCourses(course) {
    window.camDebugging.start('ExplorerMenu.userCourses');
    let ret = '';
    if (getRouteUserName()) {
      const studentID = getUserIdFromRoute();
      const courseID = course._id;
      const ci = FavoriteCourses.findNonRetired({ studentID, courseID });
      if (ci.length > 0) {
        ret = 'check green circle outline icon';
      }
      window.camDebugging.stop('ExplorerMenu.userCourses');
    }
    return ret;
  },
  userDegrees(degree) {
    let ret = '';
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      // TODO This won't work, profile does not have desiredDegreeID.
      if (_.includes(profile.desiredDegreeID, degree._id)) {
        ret = 'check green circle outline icon';
      }
    }
    return ret;
  },
  userInterests(interest) {
    window.camDebugging.start('ExplorerMenu.userInterests');
    let ret = '';
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      if (_.includes(Users.getInterestIDs(profile.userID), interest._id)) {
        ret = 'check green circle outline icon';
      }
      window.camDebugging.stop('ExplorerMenu.userInterests');
    }
    return ret;
  },
  userOpportunities(opportunity) {
    window.camDebugging.start('ExplorerMenu.userOpportunities');
    let ret = '';
    if (getRouteUserName()) {
      const studentID = getUserIdFromRoute();
      const opportunityID = opportunity._id;
      const oi = FavoriteOpportunities.findNonRetired({ studentID, opportunityID });
      if (oi.length > 0) {
        ret = 'check green circle outline icon';
      }
      window.camDebugging.stop('ExplorerMenu.userOpportunities');
    }
    return ret;
  },
  userPlans(plan) {
    window.camDebugging.start('ExplorerMenu.userPlans');
    let ret = '';
    if (getRouteUserName()) {
      const studentID = getUserIdFromRoute();
      const favorites = _.map(FavoriteAcademicPlans.find({ studentID }).fetch(),
        (p) => AcademicPlans.findDoc(p.academicPlanID)._id);
      if (_.includes(favorites, plan._id)) {
        ret = 'check green circle outline icon';
      }
      window.camDebugging.stop('ExplorerMenu.userPlans');
    }
    return ret;
  },
  usersCardRouteName() {
    window.camDebugging.start('ExplorerMenu.usersCardRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.usersCardRouteName');
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.usersCardRouteName');
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.usersCardRouteName');
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
  usersRouteName() {
    window.camDebugging.start('ExplorerMenu.usersRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('ExplorerMenu.usersRouteName');
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('ExplorerMenu.usersRouteName');
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    window.camDebugging.stop('ExplorerMenu.usersRouteName');
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
});

Template.Explorer_Menu.onRendered(function explorerMenuOnRendered() {
  // console.log('Explorer_Menu');
  const template = this;
  template.$('.ui.dropdown')
    .dropdown();
});

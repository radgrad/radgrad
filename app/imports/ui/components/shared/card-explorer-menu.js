import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';

import * as RouteNames from '../../../startup/client/router';
import { Users } from '../../../api/user/UserCollection';
import { isInRole } from '../../utilities/template-helpers';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getRouteUserName } from './route-user-name';
import { getUserIdFromRoute } from './get-user-id-from-route';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { getGroupName } from './route-group-name';

Template.Card_Explorer_Menu.helpers({
  academicPlansCardRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerPlansPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerPlansPageRouteName;
    }
    return RouteNames.mentorCardExplorerPlansPageRouteName;
  },
  academicPlansRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerPlansPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerPlansPageRouteName;
    }
    return RouteNames.mentorExplorerPlansPageRouteName;
  },
  adminEmail() {
    const admin = Users._adminUsername();
    return admin;
  },
  careerGoalsCardRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerCareerGoalsPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerCareerGoalsPageRouteName;
    }
    return RouteNames.mentorCardExplorerCareerGoalsPageRouteName;
  },
  careerGoalsRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerCareerGoalsPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerCareerGoalsPageRouteName;
    }
    return RouteNames.mentorExplorerCareerGoalsPageRouteName;
  },
  classType(item, type) {
    let ret = 'item';
    let current;
    if (type === 'course') {
      current = FlowRouter.getParam('course');
    } else if (type === 'careerGoal') {
      current = FlowRouter.getParam('careerGoal');
    } else if (type === 'degree') {
      current = FlowRouter.getParam('degree');
    } else if (type === 'plan') {
      current = FlowRouter.getParam('plan');
    } else if (type === 'interest') {
      current = FlowRouter.getParam('interest');
    } else if (type === 'opportunity') {
      current = FlowRouter.getParam('opportunity');
    }
    if (item === current) {
      ret = 'active item';
    }
    return ret;
  },
  courseName(course) {
    // console.log(course);
    const countStr = `x${course.item}`;
    if (course.count > 1) {
      return `${course.item.shortName} ${countStr}`;
    }
    return `${course.item.shortName}`;
  },
  coursesCardRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerCoursesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorCardExplorerCoursesPageRouteName;
  },
  coursesRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerCoursesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorExplorerCoursesPageRouteName;
  },
  degreesCardRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerDegreesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerDegreesPageRouteName;
    }
    return RouteNames.mentorCardExplorerDegreesPageRouteName;
  },
  degreesRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerDegreesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerDegreesPageRouteName;
    }
    return RouteNames.mentorExplorerDegreesPageRouteName;
  },
  equals(a, b) {
    const listArg = b.split(',');
    if (listArg.indexOf(a) < 0) {
      return false;
    }
    return true;
  },
  getRouteName() {
    const routeName = FlowRouter.getRouteName();
    switch (routeName) {
      case RouteNames.studentCardExplorerCareerGoalsPageRouteName:
      case RouteNames.facultyCardExplorerCareerGoalsPageRouteName:
      case RouteNames.mentorCardExplorerCareerGoalsPageRouteName:
        return 'Career Goals';
      case RouteNames.studentCardExplorerCoursesPageRouteName:
      case RouteNames.facultyCardExplorerCoursesPageRouteName:
      case RouteNames.mentorCardExplorerCoursesPageRouteName:
        return 'Courses';
      case RouteNames.studentCardExplorerPlansPageRouteName:
      case RouteNames.facultyCardExplorerPlansPageRouteName:
      case RouteNames.mentorCardExplorerPlansPageRouteName:
        return 'Academic Plans';
      case RouteNames.studentCardExplorerInterestsPageRouteName:
      case RouteNames.facultyCardExplorerInterestsPageRouteName:
      case RouteNames.mentorCardExplorerInterestsPageRouteName:
        return 'Interests';
      case RouteNames.studentCardExplorerOpportunitiesPageRouteName:
      case RouteNames.facultyCardExplorerOpportunitiesPageRouteName:
      case RouteNames.mentorCardExplorerOpportunitiesPageRouteName:
        return 'Opportunities';
      case RouteNames.studentCardExplorerUsersPageRouteName:
      case RouteNames.facultyCardExplorerUsersPageRouteName:
      case RouteNames.mentorCardExplorerUsersPageRouteName:
        return 'Users';
      default:
        return 'Select Explorer';
    }
  },
  interestsCardRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerInterestsPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerInterestsPageRouteName;
    }
    return RouteNames.mentorCardExplorerInterestsPageRouteName;
  },
  interestsRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerInterestsPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerInterestsPageRouteName;
    }
    return RouteNames.mentorExplorerInterestsPageRouteName;
  },
  isInRole,
  isType(type, value) {
    return type === value;
  },
  itemName(item) {
    // console.log(item);
    const countStr = `x${item.count}`;
    if (item.count > 1) {
      return `${item.item.name} ${countStr}`;
    }
    return `${item.item.name}`;
  },
  opportunityItemName(item) {
    // console.log(item);
    const countStr = `x${item.count}`;
    const iceString = `(${item.item.ice.i}/${item.item.ice.c}/${item.item.ice.e})`;
    if (item.count > 1) {
      return `${item.item.name} ${iceString} ${countStr}`;
    }
    return `${item.item.name} ${iceString}`;
  },
  opportunitiesCardRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerOpportunitiesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerOpportunitiesPageRouteName;
    }
    return RouteNames.mentorCardExplorerOpportunitiesPageRouteName;
  },
  opportunitiesRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerOpportunitiesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerOpportunitiesPageRouteName;
    }
    return RouteNames.mentorExplorerOpportunitiesPageRouteName;
  },
  slugName(item) {
    if (item) {
      return Slugs.findDoc(item.slugID).name;
    }
    return '';
  },
  userCareerGoals(careerGoal) {
    let ret = '';
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
        ret = 'check green circle outline icon';
      }
    }
    return ret;
  },
  userCourses(course) {
    let ret = '';
    const studentID = getUserIdFromRoute();
    const courseID = course._id;
    const ci = FavoriteCourses.findNonRetired({ studentID, courseID });
    if (ci.length > 0) {
      ret = 'check green circle outline icon';
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
    let ret = '';
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      if (_.includes(Users.getInterestIDs(profile.userID), interest._id)) {
        ret = 'check green circle outline icon';
      }
    }
    return ret;
  },
  userOpportunities(opportunity) {
    let ret = '';
    const studentID = getUserIdFromRoute();
    const opportunityID = opportunity._id;
    const oi = FavoriteOpportunities.findNonRetired({ studentID, opportunityID });
    if (oi.length > 0) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  userPlans(plan) {
    let ret = '';
    const studentID = getUserIdFromRoute();
    const favorites = _.map(FavoriteAcademicPlans.find({ studentID })
      .fetch(), (p) => AcademicPlans.findDoc(p.academicPlanID)._id);
    if (_.includes(favorites, plan._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  usersCardRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
  usersRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
});

Template.Card_Explorer_Menu.onRendered(function cardExplorerMenuOnRendered() {
  // console.log('Card_Explorer_Menu');
  const template = this;
  template.$('.ui.dropdown')
    .dropdown();
});

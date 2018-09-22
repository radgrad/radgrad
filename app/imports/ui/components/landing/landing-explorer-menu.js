import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '../../../startup/client/router.js';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Landing_Explorer_Menu.helpers({
  academicPlansCardRouteName() {
    return RouteNames.landingCardExplorerPlansPageRouteName;
  },
  academicPlansRouteName() {
    return RouteNames.landingExplorerPlansPageRouteName;
  },
  careerGoalsCardRouteName() {
    return RouteNames.landingCardExplorerCareerGoalsPageRouteName;
  },
  careerGoalsRouteName() {
    return RouteNames.landingExplorerCareerGoalsPageRouteName;
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
    return course.shortName;
  },
  coursesCardRouteName() {
    return RouteNames.landingCardExplorerCoursesPageRouteName;
  },
  coursesRouteName() {
    return RouteNames.landingExplorerCoursesPageRouteName;
  },
  degreesRouteName() {
    return RouteNames.landingExplorerDegreesPageRouteName;
  },
  equals(a, b) {
    const listArg = b.split(',');
    if (listArg.indexOf(a) < 0) {
      return false;
    }
    return true;
  },
  firstCareerGoal() {
    let ret;
    const careerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
    if (careerGoals.length > 0) {
      ret = Slugs.findDoc(careerGoals[0].slugID).name;
    }
    return ret;
  },
  firstCourse() {
    let ret;
    const courses = Courses.find({}, { sort: { shortName: 1 } }).fetch();
    if (courses.length > 0) {
      ret = Slugs.findDoc(courses[0].slugID).name;
    }
    return ret;
  },
  firstDegree() {
    let ret;
    const degrees = DesiredDegrees.find({}, { sort: { name: 1 } }).fetch();
    if (degrees.length > 0) {
      ret = Slugs.findDoc(degrees[0].slugID).name;
    }
    return ret;
  },
  firstInterest() {
    let ret;
    const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
    if (interests.length > 0) {
      ret = Slugs.findDoc(interests[0].slugID).name;
    }
    return ret;
  },
  firstOpportunity() {
    let ret;
    const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
    if (opportunities.length > 0) {
      ret = Slugs.findDoc(opportunities[0].slugID).name;
    }
    return ret;
  },
  firstPlan() {
    const semesterNumber = AcademicPlans.getLatestSemesterNumber();
    const plan = AcademicPlans.findOne({ semesterNumber });
    if (plan) {
      return (Slugs.findDoc(plan.slugID)).name;
    }
    return '';
  },
  getRoute() {
    return FlowRouter.getRouteName();
  },
  getRouteName() {
    const routeName = FlowRouter.getRouteName();
    switch (routeName) {
      case RouteNames.landingCardExplorerCareerGoalsPageRouteName:
        return 'Career Goals';
      case RouteNames.landingCardExplorerCoursesPageRouteName:
        return 'Courses';
      case RouteNames.landingCardExplorerPlansPageRouteName:
        return 'Academic Plans';
      case RouteNames.landingExplorerDegreesPageRouteName:
        return 'Degrees';
      case RouteNames.landingExplorerInterestsPageRouteName:
        return 'Interests';
      case RouteNames.landingExplorerOpportunitiesPageRouteName:
        return 'Opportunities';
      case RouteNames.landingExplorerUsersPageRouteName:
        return 'Users';
      default:
        return 'Select Explorer';
    }
  },
  interestsRouteName() {
    return RouteNames.landingExplorerInterestsPageRouteName;
  },
  isCardPage(type) {
    const routeName = FlowRouter.getRouteName();
    return type === routeName;
  },
  isType(type, value) {
    return type === value;
  },
  itemName(item) {
    return item.name;
  },
  opportunityItemName(item) {
    const iceString = `(${item.ice.i}/${item.ice.c}/${item.ice.e})`;
    return `${item.name} ${iceString}`;
  },
  opportunitiesRouteName() {
    return RouteNames.landingExplorerOpportunitiesPageRouteName;
  },
  slugName(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  userCareerGoals(careerGoal) { // eslint-disable-line
    return '';
  },
  userCourses(course) {
    let ret = '';
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    if (ci.length > 0) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  userDegrees(degree) { // eslint-disable-line
    return '';
  },
  userInterests(interest) { // eslint-disable-line
    return '';
  },
  userOpportunities(opportunity) { // eslint-disable-line
    return '';
  },
  userPlans(plan) { // eslint-disable-line
    return '';
  },
  usersRouteName() {
    return RouteNames.landingExplorerUsersPageRouteName;
  },
});

Template.Landing_Explorer_Menu.onRendered(function landingExplorerMenuOnRendered() {
  const template = this;
  template.$('.ui.dropdown')
      .dropdown();
});

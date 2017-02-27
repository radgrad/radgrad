import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';

import * as RouteNames from '/imports/startup/client/router.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { getRouteUserName } from '../../components/shared/route-user-name.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Student_Explorer_Menu.helpers({
  careerGoalsRouteName() {
    return RouteNames.studentExplorerCareerGoalsPageRouteName;
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
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  degreesRouteName() {
    return RouteNames.studentExplorerDegreesPageRouteName;
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
  interestsRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
  isType(type, value) {
    return type === value;
  },
  itemName(item) {
    return item.name;
  },
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  slugName(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  userCareerGoals(careerGoal) {
    let ret = '';
    const user = Users.findDoc({ username: getRouteUserName() });
    if (_.includes(user.careerGoalIDs, careerGoal._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
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
  userDegrees(degree) {
    let ret = '';
    const user = Users.findDoc({ username: getRouteUserName() });
    if (_.includes(user.desiredDegreeID, degree._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  userInterests(interest) {
    let ret = '';
    const user = Users.findDoc({ username: getRouteUserName() });
    if (_.includes(Users.getInterestIDs(user._id), interest._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  userOpportunities(opportunity) {
    let ret = '';
    const oi = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    if (oi.length > 0) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  usersRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
});


Template.Student_Explorer_Menu.onCreated(function studentExplorerMenuOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(DesiredDegrees.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
});


Template.Student_Explorer_Menu.onRendered(function studentExplorerMenuOnRendered() {
  const template = this;
  template.$('.ui.dropdown')
      .dropdown();
});

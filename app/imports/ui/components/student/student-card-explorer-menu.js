import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';

import * as RouteNames from '../../../startup/client/router.js';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { getRouteUserName } from '../../components/shared/route-user-name.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { isInRole } from '../../utilities/template-helpers';

Template.Student_Card_Explorer_Menu.onCreated(function studentCardExplorerMenuOnCreated() {
  this.byICS = new ReactiveVar(false);
  this.byEE = new ReactiveVar(false);
  this.by1xx = new ReactiveVar(false);
  this.by400 = new ReactiveVar(false);
});

Template.Student_Card_Explorer_Menu.helpers({
  adminEmail() {
    const admin = Users._adminUsername();
    // console.log(admin);
    return admin;
  },
  menuFilteredNonAddedList() {
    let retVal = Template.instance().data.menuNonAddedList;
    if (Template.instance().byICS.get()) {
      const profile = Users.getProfile(getRouteUserName());
      retVal = _.filter(retVal, function (item) {
        const matches = _.intersection(profile.interestIDs, item.interestIDs);
        return matches.length > 0;
      });
    }
    if (Template.instance().byEE.get()) {
      retVal = _.filter(retVal, function (item) {
        return item.ice.i >= 10;
      });
    }
    if (Template.instance().by1xx.get()) {
      retVal = _.filter(retVal, function (item) {
        return item.ice.e >= 10;
      });
    }
    if (Template.instance().by400.get()) {
      retVal = _.filter(retVal, function (item) {
        const regex = new RegExp('4[0-9][0-9]');
        return regex.test(item.number);
      });
    }
    return retVal;
  },
  isHighE() {
    return Template.instance().by1xx.get();
  },
  isHighI() {
    return Template.instance().byEE.get();
  },
  isInterests() {
    return Template.instance().byICS.get();
  },
  is400() {
    return Template.instance().by400.get();
  },
  academicPlansRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerPlansPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerPlansPageRouteName;
    }
    return RouteNames.mentorExplorerPlansPageRouteName;
  },
  careerGoalsCardRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerCareerGoalsPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerCareerGoalsPageRouteName;
    }
    return RouteNames.mentorExplorerCareerGoalsPageRouteName;
  },
  careerGoalsRouteName() {
    const group = FlowRouter.current().route.group.name;
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
    return course.shortName;
  },
  coursesCardRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerCoursesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorExplorerCoursesPageRouteName;
  },
  coursesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerCoursesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorExplorerCoursesPageRouteName;
  },
  degreesRouteName() {
    const group = FlowRouter.current().route.group.name;
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
  firstPlan() {
    const plan = AcademicPlans.findOne({}, { sort: { name: 1 } });
    if (plan) {
      return (Slugs.findDoc(plan.slugID)).name;
    }
    return '';
  },
  getRouteName() {
    const routeName = FlowRouter.getRouteName();
    switch (routeName) {
      case RouteNames.studentCardExplorerCareerGoalsPageRouteName:
        return 'Career Goals';
      case RouteNames.studentCardExplorerCoursesPageRouteName:
        return 'Courses';
      case RouteNames.studentExplorerPlansPageRouteName:
        return 'Academic Plans';
      case RouteNames.studentExplorerDegreesPageRouteName:
        return 'Degrees';
      case RouteNames.studentExplorerInterestsPageRouteName:
        return 'Interests';
      case RouteNames.studentCardExplorerOpportunitiesPageRouteName:
        return 'Opportunities';
      case RouteNames.studentExplorerUsersPageRouteName:
        return 'Users';
      default:
        return 'Select Explorer';
    }
  },
  interestsRouteName() {
    const group = FlowRouter.current().route.group.name;
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
    return item.name;
  },
  opportunityItemName(item) {
    const iceString = `(${item.ice.i}/${item.ice.c}/${item.ice.e})`;
    return `${item.name} ${iceString}`;
  },
  opportunitiesCardRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerOpportunitiesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerOpportunitiesPageRouteName;
    }
    return RouteNames.mentorExplorerOpportunitiesPageRouteName;
  },
  opportunitiesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerOpportunitiesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerOpportunitiesPageRouteName;
    }
    return RouteNames.mentorExplorerOpportunitiesPageRouteName;
  },
  slugName(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  userCareerGoals(careerGoal) {
    let ret = '';
    const profile = Users.getProfile(getRouteUserName());
    if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
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
    const profile = Users.getProfile(getRouteUserName());
    // TODO This won't work, profile does not have desiredDegreeID.
    if (_.includes(profile.desiredDegreeID, degree._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  userInterests(interest) {
    let ret = '';
    const profile = Users.getProfile(getRouteUserName());
    if (_.includes(Users.getInterestIDs(profile.userID), interest._id)) {
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
  userPlans(plan) {
    let ret = '';
    const profile = Users.getProfile(getRouteUserName());
    if (_.includes(profile.academicPlanID, plan._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  usersRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerUsersPageRouteName;
    }
    return RouteNames.mentorExplorerUsersPageRouteName;
  },
});

Template.Student_Card_Explorer_Menu.events({
  'click .jsByInterests': function clickedInterests(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by my interests');
    instance.byICS.set(!instance.byICS.get());
  },
  'click .jsByHighE': function clickedHighE(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by my interests');
    instance.by1xx.set(!instance.by1xx.get());
  },
  'click .jsByHighI': function clickedHighI(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by my interests');
    instance.byEE.set(!instance.byEE.get());
  },
  'click .jsBy400': function clickedHighI(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by my interests');
    instance.by400.set(!instance.by400.get());
  },
});

Template.Student_Card_Explorer_Menu.onRendered(function studentCardExplorerMenuOnRendered() {
  const template = this;
  template.$('.ui.dropdown')
    .dropdown();
});

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';

import * as RouteNames from '../../../startup/client/router.js';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { getRouteUserName } from '../../components/shared/route-user-name.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { isInRole } from '../../utilities/template-helpers';

Template.Student_Explorer_Menu.onCreated(function studentExplorerMenuOnCreated() {
  this.byInterests = new ReactiveVar(false);
  this.byHighI = new ReactiveVar(false);
  this.byHighE = new ReactiveVar(false);
  this.by400 = new ReactiveVar(false);
});

Template.Student_Explorer_Menu.helpers({
  adminEmail() {
    const admin = Users._adminUsername();
    // console.log(admin);
    return admin;
  },
  menuFilteredNonAddedList() {
    let retVal = Template.instance().data.menuNonAddedList;
    if (Template.instance().byInterests.get()) {
      const profile = Users.getProfile(getRouteUserName());
      retVal = _.filter(retVal, function (item) {
        const matches = _.intersection(profile.interestIDs, item.interestIDs);
        return matches.length > 0;
      });
    }
    if (Template.instance().byHighI.get()) {
      retVal = _.filter(retVal, function (item) { return item.ice.i >= 10; });
    }
    if (Template.instance().byHighE.get()) {
      retVal = _.filter(retVal, function (item) { return item.ice.e >= 10; });
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
    return Template.instance().byHighE.get();
  },
  isHighI() {
    return Template.instance().byHighI.get();
  },
  isInterests() {
    return Template.instance().byInterests.get();
  },
  is400() {
    return Template.instance().by400.get();
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
  courseName(course) {
    return course.shortName;
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
    const plan = AcademicPlans.findOne({}, { sort: { name: 1 } });
    if (plan) {
      return (Slugs.findDoc(plan.slugID)).name;
    }
    return '';
  },
  getRouteName() {
    const routeName = FlowRouter.getRouteName();
    switch (routeName) {
      case RouteNames.studentExplorerCareerGoalsPageRouteName:
        return 'Career Goals';
      case RouteNames.studentExplorerCoursesPageRouteName:
        return 'Courses';
      case RouteNames.studentExplorerPlansPageRouteName:
        return 'Academic Plans';
      case RouteNames.studentExplorerDegreesPageRouteName:
        return 'Degrees';
      case RouteNames.studentExplorerInterestsPageRouteName:
        return 'Interests';
      case RouteNames.studentExplorerOpportunitiesPageRouteName:
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
    } else
      if (group === 'faculty') {
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
  opportunitiesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerOpportunitiesPageRouteName;
    } else
      if (group === 'faculty') {
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
    } else
      if (group === 'faculty') {
        return RouteNames.facultyExplorerUsersPageRouteName;
      }
    return RouteNames.mentorExplorerUsersPageRouteName;
  },
});

Template.Student_Explorer_Menu.events({
  'click .jsByInterests': function clickedInterests(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by my interests');
    instance.byInterests.set(!instance.byInterests.get());
  },
  'click .jsByHighE': function clickedHighE(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by my interests');
    instance.byHighE.set(!instance.byHighE.get());
  },
  'click .jsByHighI': function clickedHighI(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by my interests');
    instance.byHighI.set(!instance.byHighI.get());
  },
  'click .jsBy400': function clickedHighI(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by my interests');
    instance.by400.set(!instance.by400.get());
  },
});

Template.Student_Explorer_Menu.onRendered(function studentExplorerMenuOnRendered() {
  const template = this;
  template.$('.ui.dropdown')
      .dropdown();
});

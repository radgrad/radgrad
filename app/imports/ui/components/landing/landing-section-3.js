import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

Template.Landing_Section_3.helpers({
  academicPlansRouteName() {
    return RouteNames.landingExplorerPlansPageRouteName;
  },
  careerGoalsRouteName() {
    return RouteNames.landingExplorerCareerGoalsPageRouteName;
  },
  coursesRouteName() {
    return RouteNames.landingExplorerCoursesPageRouteName;
  },
  degreesRouteName() {
    return RouteNames.landingExplorerDegreesPageRouteName;
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
  interestsRouteName() {
    return RouteNames.landingExplorerInterestsPageRouteName;
  },
  opportunitiesRouteName() {
    return RouteNames.landingExplorerOpportunitiesPageRouteName;
  },
});

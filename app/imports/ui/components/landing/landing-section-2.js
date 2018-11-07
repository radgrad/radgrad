import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

Template.Landing_Section_2.helpers({
  academicPlansRouteName() {
    return RouteNames.landingExplorerPlansPageRouteName;
  },
  careerGoalsRouteName() {
    return RouteNames.landingCardExplorerCareerGoalsPageRouteName;
  },
  coursesRouteName() {
    return RouteNames.landingCardExplorerCoursesPageRouteName;
  },
  degreesRouteName() {
    return RouteNames.landingCardExplorerDegreesPageRouteName;
  },
  firstCourse() {
    let ret = 'ics_361';
    const courses = Courses.find({}, { sort: { shortName: 1 } }).fetch();
    const notRetired = _.filter(courses, (c) => !c.retired);
    if (notRetired.length > 0) {
      ret = Slugs.findDoc(notRetired[0].slugID).name;
    }
    return ret;
  },
  firstDegree() {
    let ret = 'ba-ics';
    const degrees = DesiredDegrees.find({}, { sort: { name: 1 } }).fetch();
    if (degrees.length > 0) {
      ret = Slugs.findDoc(degrees[0].slugID).name;
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

Template.Landing_Section_2.events({
  // add your events here
});

Template.Landing_Section_2.onRendered(function landingSection2OnRendered() {
  // add your statement here
});

Template.Landing_Section_2.onDestroyed(function landingSection2OnDestroyed() {
  // add your statement here
});


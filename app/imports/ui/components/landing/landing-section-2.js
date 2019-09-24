import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

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
  interestsRouteName() {
    return RouteNames.landingCardExplorerInterestsPageRouteName;
  },
  opportunitiesRouteName() {
    return RouteNames.landingCardExplorerOpportunitiesPageRouteName;
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


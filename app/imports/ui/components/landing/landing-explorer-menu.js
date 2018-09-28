import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';

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
  degreesCardRouteName() {
    return RouteNames.landingCardExplorerDegreesPageRouteName;
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
      case RouteNames.landingCardExplorerDegreesPageRouteName:
        return 'Degrees';
      case RouteNames.landingCardExplorerInterestsPageRouteName:
        return 'Interests';
      case RouteNames.landingCardExplorerOpportunitiesPageRouteName:
        return 'Opportunities';
      default:
        return 'Select Explorer';
    }
  },
  interestsCardRouteName() {
    return RouteNames.landingCardExplorerInterestsPageRouteName;
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
  opportunitiesCardRouteName() {
    return RouteNames.landingCardExplorerOpportunitiesPageRouteName;
  },
  opportunitiesRouteName() {
    return RouteNames.landingExplorerOpportunitiesPageRouteName;
  },
  showBackButton() {
    const page = [];
    page.push(FlowRouter.getParam('careerGoal'));
    page.push(FlowRouter.getParam('course'));
    page.push(FlowRouter.getParam('degree'));
    page.push(FlowRouter.getParam('interest'));
    page.push(FlowRouter.getParam('opportunity'));
    page.push(FlowRouter.getParam('plan'));
    return _.some(page);
  },
  slugName(item) {
    return Slugs.findDoc(item.slugID).name;
  },
});

Template.Landing_Explorer_Menu.onRendered(function landingExplorerMenuOnRendered() {
  const template = this;
  template.$('.ui.dropdown')
      .dropdown();
});

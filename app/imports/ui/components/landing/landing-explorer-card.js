import { Template } from 'meteor/templating';
import { Slugs } from '../../../api/slug/SlugCollection';
import * as RouteNames from '../../../startup/client/router';

Template.Landing_Explorer_Card.onCreated(function landingExplorerCardOnCreated() {
  // add your statement here
});

Template.Landing_Explorer_Card.helpers({
  careerGoalsRouteName() {
    return RouteNames.landingExplorerCareerGoalsPageRouteName;
  },
  coursesRouteName() {
    return RouteNames.landingExplorerCoursesPageRouteName;
  },
  degreesRouteName() {
    return RouteNames.landingExplorerDegreesPageRouteName;
  },
  interestRouteName() {
    return RouteNames.landingExplorerInterestsPageRouteName;
  },
  itemName(item) {
    return item.name;
  },
  itemShortDescription(item) {
    let description = item.description;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}`;
      if (description.charAt(description.length - 1) === ' ') {
        description = `${description.substring(0, 199)}`;
      }
    }
    return description;
  },
  itemSlug(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  typeCareerGoals() {
    return (this.type === 'careergoals');
  },
  typeCourses() {
    return (this.type === 'courses');
  },
  typeDegrees() {
    return (this.type === 'degrees');
  },
  typeInterests() {
    return (this.type === 'interests');
  },
});

import { Template } from 'meteor/templating';

import * as RouteNames from '../../../startup/client/router';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getGroupName } from './route-group-name';

Template.Explorer_Card.helpers({
  careerGoalsRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerCareerGoalsPageRouteName;
    } if (group === 'faculty') {
      return RouteNames.facultyExplorerCareerGoalsPageRouteName;
    }
    return RouteNames.mentorExplorerCareerGoalsPageRouteName;
  },
  coursesRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerCoursesPageRouteName;
    } if (group === 'faculty') {
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorExplorerCoursesPageRouteName;
  },
  degreesRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerDegreesPageRouteName;
    } if (group === 'faculty') {
      return RouteNames.facultyExplorerDegreesPageRouteName;
    }
    return RouteNames.mentorExplorerDegreesPageRouteName;
  },
  interestRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerInterestsPageRouteName;
    } if (group === 'faculty') {
      return RouteNames.facultyExplorerInterestsPageRouteName;
    }
    return RouteNames.mentorExplorerInterestsPageRouteName;
  },
  itemName(item) {
    return item.name;
  },
  itemShortDescription(item) {
    let { description } = item;
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
  opportunityRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerOpportunitiesPageRouteName;
    } if (group === 'faculty') {
      return RouteNames.facultyExplorerOpportunitiesPageRouteName;
    }
    return RouteNames.mentorExplorerOpportunitiesPageRouteName;
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
  typeOpportunities() {
    return (this.type === 'opportunities');
  },
});

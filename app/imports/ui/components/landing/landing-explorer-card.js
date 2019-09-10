import { Template } from 'meteor/templating';
import { Slugs } from '../../../api/slug/SlugCollection';
import * as RouteNames from '../../../startup/client/router';
import { opportunitySemesters } from '../../utilities/template-helpers';
import { Semesters } from '../../../api/semester/SemesterCollection';

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
  itemSemesters() {
    let ret = [];
    if (this.type === 'courses') {
      // do nothing
    } else {
      ret = opportunitySemesters(this.item);
    }
    return ret;
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
    if (Slugs.isDefined(item.slugID)) {
      return Slugs.findDoc(item.slugID).name;
    }
    return '';
  },
  opportunityRouteName() {
    return RouteNames.landingExplorerOpportunitiesPageRouteName;
  },
  replaceSemString(array) {
    // console.log('array', array);
    const currentSem = Semesters.getCurrentSemesterDoc();
    const currentYear = currentSem.year;
    let fourRecentSem = _.filter(array, function isRecent(semesterYear) {
      return semesterYear.split(' ')[1] >= currentYear;
    });
    fourRecentSem = array.slice(0, 4);
    const semString = fourRecentSem.join(' - ');
    return semString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
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

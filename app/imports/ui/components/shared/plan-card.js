import { Template } from 'meteor/templating';

import * as RouteNames from '../../../startup/client/router';
import { Slugs } from '../../../api/slug/SlugCollection';
import { StudentParticipation } from '../../../api/public-stats/StudentParticipationCollection';
import { getGroupName } from './route-group-name';

/* global window */

Template.Plan_Card.helpers({
  itemName(item) {
    window.camDebugging.start('PlanCard.itemName');
    window.camDebugging.stop('PlanCard.itemName');
    return item.name;
  },
  itemShortDescription(item) {
    window.camDebugging.start('PlanCard.itemShortDescription');
    let description = item.description;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}`;
      if (description.charAt(description.length - 1) === ' ') {
        description = `${description.substring(0, 199)}`;
      }
    }
    window.camDebugging.stop('PlanCard.itemShortDescription');
    return description;
  },
  itemSlug(item) {
    window.camDebugging.start('PlanCard.itemSlug');
    const name = Slugs.findDoc(item.slugID).name;
    window.camDebugging.stop('PlanCard.itemSlug');
    return name;
  },
  numberStudents(course) {
    const item = StudentParticipation.findOne({ itemID: course._id });
    return item ? item.itemCount : 0;
  },
  plansRouteName() {
    window.camDebugging.start('PlanCard.plansRouteName');
    const group = getGroupName();
    if (group === 'student') {
      window.camDebugging.stop('PlanCard.plansRouteName');
      return RouteNames.studentExplorerPlansPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('PlanCard.plansRouteName');
      return RouteNames.facultyExplorerPlansPageRouteName;
    }
    window.camDebugging.stop('PlanCard.plansRouteName');
    return RouteNames.mentorExplorerPlansPageRouteName;
  },
});

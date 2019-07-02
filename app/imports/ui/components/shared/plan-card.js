import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import * as RouteNames from '../../../startup/client/router';
import { Slugs } from '../../../api/slug/SlugCollection';
import { StudentParticipation } from '../../../api/public-stats/StudentParticipationCollection';

Template.Plan_Card.helpers({
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
  numberStudents(course) {
    const item = StudentParticipation.findOne({ itemID: course._id });
    return item.itemCount;
  },
  plansRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerPlansPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerPlansPageRouteName;
    }
    return RouteNames.mentorExplorerPlansPageRouteName;
  },
});

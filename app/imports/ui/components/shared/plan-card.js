import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import * as RouteNames from '../../../startup/client/router';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';

function interestedStudentsHelper(item, type) {
  const interested = [];
  let instances = StudentProfiles.find({})
    .fetch();
  if (type === 'plans') {
    instances = _.filter(instances, (profile) => profile.academicPlanID === item._id);
  }
  // console.log(instances);
  _.forEach(instances, (p) => {
    if (!_.includes(interested, p.userID)) {
      interested.push(p.userID);
    }
  });
  // console.log(interested);
  return interested;
}

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
    return interestedStudentsHelper(course, this.type).length;
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

Template.Plan_Card.events({
  // add your events here
});

Template.Plan_Card.onRendered(function planCardOnRendered() {
  // add your statement here
});

Template.Plan_Card.onDestroyed(function planCardOnDestroyed() {
  // add your statement here
});


import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { ROLE } from '../../../api/role/Role.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../../components/shared/route-user-name.js';

function interestedUsers(degree) {
  const interested = [];
  const users = Users.find({ roles: [ROLE.STUDENT] }).fetch();
  _.forEach(users, (user) => {
    if (user.academicPlanID) {
      const plan = AcademicPlans.findDoc(user.academicPlanID);
      if (_.includes(plan.degreeID, degree._id)) {
        interested.push(user);
      }
    }
  });
  return interested;
}

function numUsers(degree) {
  return interestedUsers(degree).length;
}

Template.Student_Explorer_Degrees_Page.helpers({
  addedDegrees() {
    const user = Users.findDoc({ username: getRouteUserName() });
    if (user.academicPlanID) {
      const plan = AcademicPlans.findDoc(user.academicPlanID);
      return [DesiredDegrees.findDoc(plan.degreeID)];
    }
    return [];
  },
  degree() {
    const degreeSlugName = FlowRouter.getParam('degree');
    const slug = Slugs.find({ name: degreeSlugName }).fetch();
    const degree = DesiredDegrees.find({ slugID: slug[0]._id }).fetch();
    return degree[0];
  },
  descriptionPairs(degree) {
    return [
      { label: 'Description', value: degree.description },
    ];
  },
  nonAddedDegrees() {
    const allDegrees = DesiredDegrees.find({}, { sort: { name: 1 } }).fetch();
    const user = Users.findDoc({ username: getRouteUserName() });
    const nonAddedDegrees = _.filter(allDegrees, function (degree) {
      if (_.includes(user.desiredDegreeID, degree._id)) {
        return false;
      }
      return true;
    });
    return nonAddedDegrees;
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  socialPairs(degree) {
    return [
      { label: 'students', amount: numUsers(degree),
        value: interestedUsers(degree) },
    ];
  },
});


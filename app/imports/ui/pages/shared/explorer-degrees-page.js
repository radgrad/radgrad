import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Users } from '../../../api/user/UserCollection';
import { getRouteUserName } from '../../components/shared/route-user-name';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { ROLE } from '../../../api/role/Role';

function interestedUsers(degree) {
  const interested = [];
  const profiles = Users.findProfilesWithRole(ROLE.STUDENT);
  _.forEach(profiles, (profile) => {
    if (profile.academicPlanID) {
      const plan = AcademicPlans.findDoc(profile.academicPlanID);
      if (_.includes(plan.degreeID, degree._id)) {
        interested.push(profile);
      }
    }
  });
  return interested;
}

function numUsers(degree) {
  return interestedUsers(degree).length;
}

Template.Explorer_Degrees_Page.helpers({
  addedDegrees() {
    const profile = Users.getProfile(getRouteUserName());
    if (profile.academicPlanID) {
      const plan = AcademicPlans.findDoc(profile.academicPlanID);
      return [DesiredDegrees.findDoc(plan.degreeID)];
    }
    return [];
  },
  degree() {
    const degreeSlugName = FlowRouter.getParam('degree');
    const slug = Slugs.find({ name: degreeSlugName }).fetch();
    const degree = DesiredDegrees.findNonRetired({ slugID: slug[0]._id });
    return degree[0];
  },
  descriptionPairs(degree) {
    return [
      { label: 'Description', value: degree.description },
    ];
  },
  nonAddedDegrees() {
    const allDegrees = DesiredDegrees.findNonRetired({}, { sort: { name: 1 } });
    const profile = Users.getProfile(getRouteUserName());
    const nonAddedDegrees = _.filter(allDegrees, function (degree) {
      // TODO This won't work; no profile.desiredDegreeID.
      if (_.includes(profile.desiredDegreeID, degree._id)) {
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

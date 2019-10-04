import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { ROLE } from '../../../api/role/Role.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../../components/shared/route-user-name.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';

function interestedUsers(plan) {
  const interested = [];
  const profiles = Users.findProfilesWithRole(ROLE.STUDENT);
  _.forEach(profiles, (profile) => {
    if (profile.academicPlanID === plan._id) {
      interested.push(profile);
    }
  });
  return interested;
}

function numUsers(plan) {
  return interestedUsers(plan).length;
}


Template.Explorer_Plans_Page.helpers({
  addedPlans() {
    const studentID = getUserIdFromRoute();
    const favorites = FavoriteAcademicPlans.find({ studentID }).fetch();
    const plans = _.map(favorites, (p) => ({ item: AcademicPlans.findDoc(p.academicPlanID), count: 1 }));
    return plans;
  },
  descriptionPairs(plan) {
    if (plan) {
      const degree = DesiredDegrees.findDoc(plan.degreeID);
      const description = `${degree.description}\n\n${plan.description}`;
      return [
        { label: 'Description', value: description },
      ];
    }
    return [];
  },
  nonAddedPlans() {
    const allPlans = AcademicPlans.findNonRetired({}, { sort: { semesterNumber: 1, name: 1 } });
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      const nonAddedPlans = _.filter(allPlans, function (plan) {
        if (_.includes(profile.academicPlanID, plan._id)) {
          return false;
        }
        return true;
      });
      return _.map(nonAddedPlans, (p) => ({ item: p, count: 1 }));
    }
    return _.map(allPlans, (p) => ({ item: p, count: 1 }));
  },
  plan() {
    const planSlugName = FlowRouter.getParam('plan');
    if (planSlugName) {
      const slug = Slugs.findDoc({ name: planSlugName });
      return AcademicPlans.findDoc({ slugID: slug._id });
    }
    return '';
  },
  slugName(slugID) {
    if (slugID) {
      return Slugs.findDoc(slugID).name;
    }
    return '';
  },
  socialPairs(plan) {
    if (plan) {
      return [
        {
          label: 'students', amount: numUsers(plan),
          value: interestedUsers(plan),
        },
      ];
    }
    return [];
  },
});

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { ROLE } from '../../../api/role/Role.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

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


Template.Landing_Explorer_Plans_Page.helpers({
  addedPlans() {
    return [];
  },
  descriptionPairs(plan) {
    const degree = DesiredDegrees.findDoc(plan.degreeID);
    const description = `${degree.description}\n\n${plan.description}`;
    return [
      { label: 'Description', value: description },
    ];
  },
  nonAddedPlans() {
    const semesterNumber = AcademicPlans.getLatestSemesterNumber();
    return AcademicPlans.findNonRetired({ semesterNumber }, { sort: { name: 1 } });
  },
  plan() {
    const planSlugName = FlowRouter.getParam('plan');
    const slug = Slugs.findDoc({ name: planSlugName });
    return AcademicPlans.findDoc({ slugID: slug._id });
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  socialPairs(plan) {
    return [
      { label: 'students', amount: numUsers(plan),
        value: interestedUsers(plan) },
    ];
  },
});

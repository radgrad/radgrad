import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import { getRouteUserName } from '../../components/shared/route-user-name.js';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { StudentParticipation } from '../../../api/public-stats/StudentParticipationCollection';


function interestedUsers(careerGoal, role) {
  const interested = [];
  const profiles = Users.findProfilesWithRole(role);
  _.forEach(profiles, (profile) => {
    if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
      interested.push(profile);
    }
  });
  return _.filter(interested, (profile) => profile.picture && profile.picture !== defaultProfilePicture);
}

function numUsers(careerGoal, role) {
  return interestedUsers(careerGoal, role).length;
}

function numStudents(careerGoal) {
  const item = StudentParticipation.findOne({ itemID: careerGoal._id });
  return item.itemCount;
}

Template.Explorer_CareerGoals_Page.helpers({
  addedCareerGoals() {
    const addedCareerGoals = [];
    if (getRouteUserName()) {
      const allCareerGoals = CareerGoals.find({}, { sort: { name: 1 } })
        .fetch();
      const profile = Users.getProfile(getRouteUserName());
      _.forEach(allCareerGoals, (careerGoal) => {
        if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
          addedCareerGoals.push({ item: careerGoal, count: 1 });
        }
      });
    }
    return addedCareerGoals;
  },
  careerGoal() {
    const careerGoalSlugName = FlowRouter.getParam('careerGoal');
    if (careerGoalSlugName) {
      const slug = Slugs.find({ name: careerGoalSlugName })
        .fetch();
      const careerGoal = CareerGoals.find({ slugID: slug[0]._id })
        .fetch();
      return careerGoal[0];
    }
    return '';
  },
  descriptionPairs(careerGoal) {
    if (careerGoal) {
      return [
        { label: 'Description', value: careerGoal.description },
        { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
      ];
    }
    return [];
  },
  nonAddedCareerGoals() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      const allCareerGoals = CareerGoals.find({}, { sort: { name: 1 } })
        .fetch();
      const nonAddedCareerGoals = _.filter(allCareerGoals, function (careerGoal) {
        if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
          return false;
        }
        return true;
      });
      return nonAddedCareerGoals;
    }
    return CareerGoals.findNonRetired({}, { sort: { name: 1 } });
  },
  slugName(slugID) {
    if (slugID) {
      return Slugs.findDoc(slugID).name;
    }
    return '';
  },
  socialPairs(careerGoal) {
    if (careerGoal) {
      return [
        {
          label: 'students', amount: numStudents(careerGoal),
          value: interestedUsers(careerGoal, ROLE.STUDENT),
        },
        {
          label: 'faculty members', amount: numUsers(careerGoal, ROLE.FACULTY),
          value: interestedUsers(careerGoal, ROLE.FACULTY),
        },
        { label: 'alumni', amount: numUsers(careerGoal, ROLE.ALUMNI), value: interestedUsers(careerGoal, ROLE.ALUMNI) },
        {
          label: 'mentors',
          amount: numUsers(careerGoal, ROLE.MENTOR),
          value: interestedUsers(careerGoal, ROLE.MENTOR),
        },
      ];
    }
    return [];
  },
});


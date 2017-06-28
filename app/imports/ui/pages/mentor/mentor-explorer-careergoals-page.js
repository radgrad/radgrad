import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import { getRouteUserName } from '../../components/shared/route-user-name.js';


function interestedUsers(careerGoal, role) {
  const interested = [];
  const users = Users.find({ roles: [role] }).fetch();
  _.forEach(users, (user) => {
    if (_.includes(user.careerGoalIDs, careerGoal._id)) {
      interested.push(user);
    }
  });
  return interested;
}

function numUsers(careerGoal, role) {
  return interestedUsers(careerGoal, role).length;
}

Template.Mentor_Explorer_CareerGoals_Page.helpers({
  addedCareerGoals() {
    const addedCareerGoals = [];
    const allCareerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
    const user = Users.findDoc({ username: getRouteUserName() });
    _.forEach(allCareerGoals, (careerGoal) => {
      if (_.includes(user.careerGoalIDs, careerGoal._id)) {
        addedCareerGoals.push(careerGoal);
      }
    });
    return addedCareerGoals;
  },
  careerGoal() {
    const careerGoalSlugName = FlowRouter.getParam('careerGoal');
    const slug = Slugs.find({ name: careerGoalSlugName }).fetch();
    const careerGoal = CareerGoals.find({ slugID: slug[0]._id }).fetch();
    return careerGoal[0];
  },
  descriptionPairs(careerGoal) {
    return [
      { label: 'Description', value: careerGoal.description },
      { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
    ];
  },
  nonAddedCareerGoals() {
    const user = Users.findDoc({ username: getRouteUserName() });
    const allCareerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
    const nonAddedCareerGoals = _.filter(allCareerGoals, function (careerGoal) {
      if (_.includes(user.careerGoalIDs, careerGoal._id)) {
        return false;
      }
      return true;
    });
    return nonAddedCareerGoals;
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  socialPairs(careerGoal) {
    return [
      { label: 'students', amount: numUsers(careerGoal, ROLE.STUDENT),
        value: interestedUsers(careerGoal, ROLE.STUDENT) },
      { label: 'faculty members', amount: numUsers(careerGoal, ROLE.FACULTY),
        value: interestedUsers(careerGoal, ROLE.FACULTY) },
      { label: 'alumni', amount: numUsers(careerGoal, ROLE.ALUMNI), value: interestedUsers(careerGoal, ROLE.ALUMNI) },
      { label: 'mentors', amount: numUsers(careerGoal, ROLE.MENTOR), value: interestedUsers(careerGoal, ROLE.MENTOR) },
    ];
  },
});


import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { makeLink } from '../../components/admin/datamodel-utilities';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';

function interestedUsers(careerGoal, role) {
  const interested = [];
  const users = Users.find({ roles: [role] }).fetch();
  _.map(users, (user) => {
    if (_.includes(user.careerGoalIDs, careerGoal._id)) {
      interested.push(user);
    }
  });
  return interested;
}

function numUsers(careerGoal, role) {
  return interestedUsers(careerGoal, role).length;
}

Template.Student_Explorer_CareerGoals_Page.helpers({
  careerGoal() {
    const careerGoalSlugName = FlowRouter.getParam('careerGoal');
    const slug = Slugs.find({ name: careerGoalSlugName }).fetch();
    const careerGoal = CareerGoals.find({ slugID: slug[0]._id }).fetch();
    return careerGoal[0];
  },
  careerGoals() {
    return CareerGoals.find({}, { sort: { name: 1 } }).fetch();
  },
  courseName(careerGoal) {
    return careerGoal.name;
  },
  count() {
    return CareerGoals.count();
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(careerGoal) {
    return [
      { label: 'Description', value: careerGoal.description },
      { label: 'More Information', value: makeLink(careerGoal.moreInformation) },
      { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
    ];
  },
  socialPairs(careerGoal) {
    return [
      { label: 'students', amount: numUsers(careerGoal, ROLE.STUDENT),
        value: interestedUsers(careerGoal, ROLE.STUDENT) },
      { label: 'faculty members', amount: numUsers(careerGoal, ROLE.FACULTY),
        value: interestedUsers(careerGoal, ROLE.FACULTY) },
      { label: 'alumni', amount: numUsers(careerGoal, ROLE.ALUMNI), value: interestedUsers(careerGoal, ROLE.ALUMNI) },
    ];
  },
});

Template.Student_Explorer_CareerGoals_Page.onCreated(function studentExplorerCareerGoalsPageOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Interests.getPublicationName());
});

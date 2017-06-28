import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { ROLE } from '../../../api/role/Role.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

function interestedUsers(degree) {
  const interested = [];
  const users = Users.find({ roles: [ROLE.STUDENT] }).fetch();
  _.forEach(users, (user) => {
    if (_.includes(user.desiredDegreeID, degree._id)) {
      interested.push(user);
    }
  });
  return interested;
}

function numUsers(degree) {
  return interestedUsers(degree).length;
}

Template.Mentor_Explorer_Degrees_Page.helpers({
  addedDegrees() {
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
    return DesiredDegrees.find({}, { sort: { name: 1 } }).fetch();
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


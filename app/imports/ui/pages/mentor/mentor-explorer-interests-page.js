import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import { getRouteUserName } from '../../components/shared/route-user-name.js';

function courses(interest) {
  const allCourses = Courses.find().fetch();
  const matching = [];
  _.forEach(allCourses, (course) => {
    if (_.includes(course.interestIDs, interest._id)) {
      matching.push(Slugs.findDoc(course.slugID).name);
    }
  });
  return matching;
}

function opportunities(interest) {
  const allOpportunities = Opportunities.find().fetch();
  const matching = [];
  _.forEach(allOpportunities, (opportunity) => {
    if (_.includes(opportunity.interestIDs, interest._id)) {
      matching.push(Slugs.findDoc(opportunity.slugID).name);
    }
  });
  return matching;
}

function interestedUsers(interest, role) {
  const interested = [];
  const users = Users.find({ roles: [role] }).fetch();
  _.forEach(users, (user) => {
    if (_.includes(user.interestIDs, interest._id)) {
      interested.push(user);
    }
  });
  return interested;
}

function numUsers(interest, role) {
  return interestedUsers(interest, role).length;
}

function careerGoals(interest) {
  const allCareerGoals = CareerGoals.find().fetch();
  const matching = [];
  _.forEach(allCareerGoals, (careerGoal) => {
    if (_.includes(careerGoal.interestIDs, interest._id)) {
      matching.push(careerGoal);
    }
  });
  return matching;
}

Template.Mentor_Explorer_Interests_Page.helpers({
  addedCareerInterests() {
    const user = Users.findDoc({ username: getRouteUserName() });
    const allInterests = Users.getInterestIDsByType(user._id);
    return _.map(allInterests[1], (interest) => Interests.findDoc(interest));
  },
  addedInterests() {
    const addedInterests = [];
    const allInterests = Interests.find({}, { sort: { name: 1 } }).fetch();
    const user = Users.findDoc({ username: getRouteUserName() });
    _.forEach(allInterests, (interest) => {
      if (_.includes(user.interestIDs, interest._id)) {
        addedInterests.push(interest);
      }
    });
    return addedInterests;
  },
  descriptionPairs(interest) {
    return [
      { label: 'Description', value: interest.description },
      { label: 'Related Career Goals', value: careerGoals(interest) },
      { label: 'Related Courses', value: courses(interest) },
      { label: 'Related Opportunities', value: opportunities(interest) },
    ];
  },
  interest() {
    const interestSlugName = FlowRouter.getParam('interest');
    const slug = Slugs.find({ name: interestSlugName }).fetch();
    const interest = Interests.find({ slugID: slug[0]._id }).fetch();
    return interest[0];
  },
  nonAddedInterests() {
    const allInterests = Interests.find({}, { sort: { name: 1 } }).fetch();
    const user = Users.findDoc({ username: getRouteUserName() });
    const nonAddedInterests = _.filter(allInterests, function (interest) {
      if (_.includes(Users.getInterestIDs(user._id), interest._id)) {
        return false;
      }
      return true;
    });
    return nonAddedInterests;
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  socialPairs(interest) {
    return [
      { label: 'students', amount: numUsers(interest, ROLE.STUDENT),
        value: interestedUsers(interest, ROLE.STUDENT) },
      { label: 'faculty members', amount: numUsers(interest, ROLE.FACULTY),
        value: interestedUsers(interest, ROLE.FACULTY) },
      { label: 'alumni', amount: numUsers(interest, ROLE.ALUMNI), value: interestedUsers(interest, ROLE.ALUMNI) },
      { label: 'mentor', amount: numUsers(interest, ROLE.MENTOR), value: interestedUsers(interest, ROLE.MENTOR) },
    ];
  },
});


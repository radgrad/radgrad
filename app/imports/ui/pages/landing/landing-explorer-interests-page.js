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

function courses(interest) {
  const allCourses = Courses.findNonRetired();
  const matching = [];
  _.forEach(allCourses, (course) => {
    if (_.includes(course.interestIDs, interest._id)) {
      matching.push(Slugs.findDoc(course.slugID).name);
    }
  });
  return matching;
}

function opportunities(interest) {
  const allOpportunities = Opportunities.findNonRetired();
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
  const profiles = Users.findProfilesWithRole(role);
  _.forEach(profiles, (profile) => {
    if (_.includes(profile.interestIDs, interest._id)) {
      interested.push(profile);
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

Template.Landing_Explorer_Interests_Page.helpers({
  addedCareerInterests() {
    return [];
  },
  addedInterests() {
    return Interests.find({}, { sort: { name: 1 } }).fetch();
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
    return [];
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  socialPairs(interest) {
    return [
      {
        label: 'students', amount: numUsers(interest, ROLE.STUDENT),
        value: interestedUsers(interest, ROLE.STUDENT),
      },
      {
        label: 'faculty members', amount: numUsers(interest, ROLE.FACULTY),
        value: interestedUsers(interest, ROLE.FACULTY),
      },
      { label: 'mentor', amount: numUsers(interest, ROLE.MENTOR), value: interestedUsers(interest, ROLE.MENTOR) },
      { label: 'alumni', amount: numUsers(interest, ROLE.ALUMNI), value: interestedUsers(interest, ROLE.ALUMNI) },
    ];
  },
});

import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { makeLink } from '../../components/admin/datamodel-utilities';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';

function interestedUsers(interest, role) {
  const interested = [];
  const users = Users.find({ roles: [role] }).fetch();
  _.map(users, (user) => {
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
  _.map(allCareerGoals, (careerGoal) => {
    if (_.includes(careerGoal.interestIDs, interest._id)) {
      matching.push(careerGoal);
  }
});
  return matching;
}
function courses(interest) {
  const allCourses = Courses.find().fetch();
  const matching = [];
  _.map(allCourses, (course) => {
    if (_.includes(course.interestIDs, interest._id)) {
      matching.push(Slugs.findDoc(course.slugID).name);
  }
});
  return matching;
}
function opportunities(interest) {
  const allOpportunities = Opportunities.find().fetch();
  const matching = [];
  _.map(allOpportunities, (opportunity) => {
    if (_.includes(opportunity.interestIDs, interest._id)) {
      matching.push(Slugs.findDoc(opportunity.slugID).name);
    }
  });
  return matching;
}

Template.Student_Explorer_Interests_Page.helpers({
  interest() {
    const interestSlugName = FlowRouter.getParam('interest');
    const slug = Slugs.find({ name: interestSlugName }).fetch();
    const interest = Interests.find({ slugID: slug[0]._id }).fetch();
    return interest[0];
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } }).fetch();
  },
  interestName(interest) {
    return interest.name;
  },
  count() {
    return Interests.count();
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(interest) {
    return [
      { label: 'Description', value: interest.description },
      { label: 'More Information', value: makeLink(interest.moreInformation) },
      { label: 'Related Courses', value: courses(interest) },
      { label: 'Related Opportunities', value: opportunities(interest) },
      { label: 'Related Career Goals', value: careerGoals(interest) },
      { label: 'student(s)', value: numUsers(interest, ROLE.STUDENT), type: 'amount' },
      { label: 'Students', value: interestedUsers(interest, ROLE.STUDENT), type: 'list' },
      { label: 'faculty member(s)', value: numUsers(interest, ROLE.FACULTY), type: 'amount' },
      { label: 'Faculty Members', value: interestedUsers(interest, ROLE.FACULTY), type: 'list' },
      { label: 'alumni', value: numUsers(interest, ROLE.ALUMNI), type: 'amount' },
      { label: 'Alumni', value: interestedUsers(interest, ROLE.ALUMNI), type: 'list' },
    ];
  },
});

Template.Student_Explorer_Interests_Page.onCreated(function studentExplorerInterestsPageOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
});

import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { makeLink } from '../../components/admin/datamodel-utilities';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

function coursesHelper(interest) {
  const allCourses = Courses.find().fetch();
  const matching = [];
  _.map(allCourses, (course) => {
    if (_.includes(course.interestIDs, interest._id)) {
      matching.push(Slugs.findDoc(course.slugID).name);
    }
  });
  return matching;
}

function passedCourseHelper(courseSlugName) {
  let ret = 'Not in plan';
  const slug = Slugs.find({ name: courseSlugName }).fetch();
  const course = Courses.find({ slugID: slug[0]._id }).fetch();
  const ci = CourseInstances.find({
    studentID: getUserIdFromRoute(),
    courseID: course[0]._id,
  }).fetch();
  _.map(ci, (c) => {
    if (c.verified === true) {
    if (c.grade === 'A+' || c.grade === 'A' || c.grade === 'A-' || c.grade === 'B+' ||
        c.grade === 'B' || c.grade === 'B-') {
      ret = 'Completed';
    } else {
      ret = 'In plan, but not yet complete';
    }
  } else {
    ret = 'In plan, but not yet complete';
  }
});
  return ret;
}

function courses(interest) {
  const list = coursesHelper(interest);
  const complete = [];
  const incomplete = [];
  const notInPlan = [];
  let itemStatus = '';
  _.map(list, (item) => {
    itemStatus = passedCourseHelper(item);
  if (itemStatus === 'Not in plan') {
    notInPlan.push({ course: item, status: itemStatus });
  } else if (itemStatus === 'Completed') {
    complete.push({ course: item, status: itemStatus });
  } else {
    incomplete.push({ course: item, status: itemStatus });
  }
});
  console.log(incomplete);
  return [complete, incomplete, notInPlan];
}

function verifiedOpportunityHelper(opportunitySlugName) {
  let ret = 'Not in plan';
  const slug = Slugs.find({ name: opportunitySlugName }).fetch();
  const opportunity = Opportunities.find({ slugID: slug[0]._id }).fetch();
  const oi = OpportunityInstances.find({
    studentID: getUserIdFromRoute(),
    opportunityID: opportunity[0]._id,
  }).fetch();
  _.map(oi, (o) => {
    if (o.verified === true) {
      ret = 'Completed and verified';
    } else {
      ret = 'In plan, but not yet verified';
    }
  });
  return ret;
}

function opportunitiesHelper(interest) {
  const allOpportunities = Opportunities.find().fetch();
  const matching = [];
  _.map(allOpportunities, (opportunity) => {
    if (_.includes(opportunity.interestIDs, interest._id)) {
    matching.push(Slugs.findDoc(opportunity.slugID).name);
  }
});
  return matching;
}

function opportunities(interest) {
  const list = opportunitiesHelper(interest);
  const complete = [];
  const incomplete = [];
  const notInPlan = [];
  let itemStatus = '';
  _.map(list, (item) => {
    itemStatus = verifiedOpportunityHelper(item);
  if (itemStatus === 'Not in plan') {
    notInPlan.push({ opportunity: item, status: itemStatus });
  } else if (itemStatus === 'Completed and verified') {
    complete.push({ opportunity: item, status: itemStatus });
  } else {
    incomplete.push({ opportunity: item, status: itemStatus });
  }
});
  return [complete, incomplete, notInPlan];
}

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
      { label: 'Related Career Goals', value: careerGoals(interest) },
      { label: 'Related Courses', value: courses(interest) },
      { label: 'Related Opportunities', value: opportunities(interest) },
    ];
  },
  socialPairs(interest) {
    return [
      { label: 'students', amount: numUsers(interest, ROLE.STUDENT),
        value: interestedUsers(interest, ROLE.STUDENT) },
      { label: 'faculty members', amount: numUsers(interest, ROLE.FACULTY),
        value: interestedUsers(interest, ROLE.FACULTY) },
      { label: 'alumni', amount: numUsers(interest, ROLE.ALUMNI), value: interestedUsers(interest, ROLE.ALUMNI) },
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

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
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { getRouteUserName } from '../../components/shared/route-user-name.js';

function coursesHelper(interest) {
  const allCourses = Courses.find().fetch();
  const matching = [];
  _.forEach(allCourses, (course) => {
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
  _.forEach(ci, (c) => {
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
  _.forEach(list, (item) => {
    itemStatus = passedCourseHelper(item);
    if (itemStatus === 'Not in plan') {
      notInPlan.push({ course: item, status: itemStatus });
    } else if (itemStatus === 'Completed') {
      complete.push({ course: item, status: itemStatus });
    } else if (itemStatus === 'In plan, but not yet complete') {
      incomplete.push({ course: item, status: itemStatus });
    } else {
      console.log('Invalid course status');
    }
  });
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
  _.forEach(oi, (o) => {
    if (o.verified === true) {
      ret = 'Completed';
    } else {
      ret = 'In plan, but not yet complete';
    }
  });
  return ret;
}

function opportunitiesHelper(interest) {
  const allOpportunities = Opportunities.find().fetch();
  const matching = [];
  _.forEach(allOpportunities, (opportunity) => {
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
  _.forEach(list, (item) => {
    itemStatus = verifiedOpportunityHelper(item);
    if (itemStatus === 'Not in plan') {
      notInPlan.push({ opportunity: item, status: itemStatus });
    } else if (itemStatus === 'Completed') {
      complete.push({ opportunity: item, status: itemStatus });
    } else if (itemStatus === 'In plan, but not yet complete') {
      incomplete.push({ opportunity: item, status: itemStatus });
    } else {
      console.log('Invalid opportunity status');
    }
  });
  return [complete, incomplete, notInPlan];
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

Template.Student_Explorer_Interests_Page.helpers({
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


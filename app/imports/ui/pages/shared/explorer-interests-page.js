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
import { StudentParticipation } from '../../../api/public-stats/StudentParticipationCollection';

function coursesHelper(interest) {
  const allCourses = Courses.findNonRetired();
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
  const course = Courses.findNonRetired({ slugID: slug[0]._id });
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
  const slug = Slugs.findDoc({ name: opportunitySlugName });
  const opportunity = Opportunities.findDoc({ slugID: slug._id });
  const oi = OpportunityInstances.find({
    studentID: getUserIdFromRoute(),
    opportunityID: opportunity._id,
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
  const allOpportunities = Opportunities.findNonRetired();
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

function numStudents(interest) {
  const item = StudentParticipation.findOne({ itemID: interest._id });
  return item.itemCount;
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

Template.Explorer_Interests_Page.helpers({
  addedCareerInterests() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      const allInterests = Users.getInterestIDsByType(profile.userID);
      return _.map(allInterests[1], (interest) => ({ item: Interests.findDoc(interest), count: 1 }));
    }
    return [];
  },
  addedInterests() {
    const addedInterests = [];
    if (getRouteUserName()) {
      const allInterests = Interests.find({}, { sort: { name: 1 } })
        .fetch();
      const profile = Users.getProfile(getRouteUserName());
      _.forEach(allInterests, (interest) => {
        if (_.includes(profile.interestIDs, interest._id)) {
          addedInterests.push({ item: interest, count: 1 });
        }
      });
    }
    return addedInterests;
  },
  descriptionPairs(interest) {
    if (interest) {
      return [
        { label: 'Description', value: interest.description },
        { label: 'Related Career Goals', value: careerGoals(interest) },
        { label: 'Related Courses', value: courses(interest) },
        { label: 'Related Opportunities', value: opportunities(interest) },
      ];
    }
    return [];
  },
  interest() {
    const interestSlugName = FlowRouter.getParam('interest');
    if (interestSlugName) {
      const slug = Slugs.find({ name: interestSlugName })
        .fetch();
      const interest = Interests.find({ slugID: slug[0]._id })
        .fetch();
      return interest[0];
    }
    return '';
  },
  nonAddedInterests() {
    const allInterests = Interests.find({}, { sort: { name: 1 } }).fetch();
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      const nonAddedInterests = _.filter(allInterests, function (interest) {
        if (_.includes(Users.getInterestIDs(profile.userID), interest._id)) {
          return false;
        }
        return true;
      });
      return nonAddedInterests;
    }
    return allInterests;
  },
  slugName(slugID) {
    if (slugID) {
      return Slugs.findDoc(slugID).name;
    }
    return '';
  },
  socialPairs(interest) {
    if (interest) {
      return [
        {
          label: 'students', amount: numStudents(interest),
          value: interestedUsers(interest, ROLE.STUDENT),
        },
        {
          label: 'faculty members', amount: numUsers(interest, ROLE.FACULTY),
          value: interestedUsers(interest, ROLE.FACULTY),
        },
        { label: 'alumni', amount: numUsers(interest, ROLE.ALUMNI), value: interestedUsers(interest, ROLE.ALUMNI) },
        { label: 'mentor', amount: numUsers(interest, ROLE.MENTOR), value: interestedUsers(interest, ROLE.MENTOR) },
      ];
    }
    return [];
  },
});


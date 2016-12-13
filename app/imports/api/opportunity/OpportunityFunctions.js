import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Opportunities } from './OpportunityCollection';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import { Users } from '../user/UserCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';

function getRandomInt(min, max) {
  min = Math.ceil(min);  // eslint-disable-line no-param-reassign
  max = Math.floor(max);  // eslint-disable-line no-param-reassign
  return Math.floor(Math.random() * (max - min)) + min;
}

export const clearPlannedOpportunityInstances = (studentID) => {
  const courses = OpportunityInstances.find({ studentID, verified: false }).fetch();
  _.map(courses, (oi) => {
    const requests = VerificationRequests.find({ studentID, opportunityInstanceID: oi._id }).fetch();
    if (requests.length === 0) {
      Meteor.call('Collection.remove', {
        collectionName: 'OpportunityInstances',
        id: oi._id,
      });
    }
  });
};

export const calculateOpportunityCompatibility = (opportunityID, studentID) => {
  const course = Opportunities.findDoc(opportunityID);
  const student = Users.findDoc(studentID);
  const intersection = _.intersection(course.interestIDs, student.interestIDs);
  return intersection.length;
};

export const semesterOpportunities = (semester, semesterNumber) => {
  const id = semester._id;
  const opps = Opportunities.find().fetch();
  const semesterOpps = _.filter(opps, function filter(opportunity) {
    return _.indexOf(opportunity.semesterIDs, id) !== -1;
  });
  if (semesterNumber < 3) { // AY 1.
    return _.filter(semesterOpps, function onlyEvents(opportunity) {
      const type = Opportunities.getOpportunityTypeDoc(opportunity._id);
      return type.name === 'Event' || type.name === 'Club';
    });
  }
  return semesterOpps;
};

export const getStudentSemesterOpportunityChoices = (semester, semesterNumber, studentID) => {
  const arr = {};
  let max = 0;
  const opportunities = semesterOpportunities(semester, semesterNumber);
  _.map(opportunities, (opportunity) => {
    const score = calculateOpportunityCompatibility(opportunity._id, studentID);
    if (score > max) {
      max = score;
    }
    if (!arr[score]) {
      arr[score] = [];
    }
    arr[score].push(opportunity);
  });
  arr.max = max;
  return arr;
};

export const chooseStudentSemesterOpportunity = (semester, semesterNumber, studentID) => {
  const choices = getStudentSemesterOpportunityChoices(semester, semesterNumber, studentID);
  const best = choices[choices.max];
  if (best) {
    return best[getRandomInt(0, best.length)];
  }
  return undefined;
};

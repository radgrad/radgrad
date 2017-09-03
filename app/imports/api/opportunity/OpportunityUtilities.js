import { _ } from 'meteor/erasaur:meteor-lodash';
import { Opportunities } from './OpportunityCollection';
import { OpportunityInstances } from './OpportunityInstanceCollection';
import PreferredChoice from '../degree-plan/PreferredChoice';
import { Semesters } from '../semester/SemesterCollection';
import { Users } from '../user/UserCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';
import { getStudentsCurrentSemesterNumber } from '../degree-plan/AcademicYearUtilities';

/**
 * Returns a random int between min and max.
 * @param min the minimum value for the random number.
 * @param max the maximum value for the random number.
 * @return {*}
 * @memberOf api/opportunity
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);  // eslint-disable-line no-param-reassign
  max = Math.floor(max);  // eslint-disable-line no-param-reassign
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Removes the planned Opportunities for the given studentID.
 * @param studentID
 * @memberOf api/opportunity
 */
export function clearPlannedOpportunityInstances(studentID) {
  const courses = OpportunityInstances.find({ studentID, verified: false }).fetch();
  _.forEach(courses, (oi) => {
    const requests = VerificationRequests.find({ studentID, opportunityInstanceID: oi._id }).fetch();
    if (requests.length === 0) {
      OpportunityInstances.removeIt(oi);
    }
  });
}

export const calculateOpportunityCompatibility = (opportunityID, studentID) => {
  const course = Opportunities.findDoc(opportunityID);
  const studentInterests = Users.getProfile(studentID).interestIDs;
  const intersection = _.intersection(course.interestIDs, studentInterests);
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
      return type.name === 'Club';
    });
  } else if (semesterNumber < 6) {
    return _.filter(semesterOpps, function onlyEvents(opportunity) {
      const type = Opportunities.getOpportunityTypeDoc(opportunity._id);
      return type.name === 'Event' || type.name === 'Club';
    });
  }
  return semesterOpps;
};

export const getStudentSemesterOpportunityChoices = (semester, semesterNumber, studentID) => {
  const opportunities = semesterOpportunities(semester, semesterNumber);
  const oppInstances = OpportunityInstances.find({ studentID }).fetch();
  const filtered = _.filter(opportunities, function removeInstances(opp) {
    let taken = true;
    _.forEach(oppInstances, (oi) => {
      if (oi.opportunityID === opp._id) {
        taken = false;
      }
    });
    return taken;
  });
  return filtered;
};

export const chooseStudentSemesterOpportunity = (semester, semesterNumber, studentID) => {
  const choices = getStudentSemesterOpportunityChoices(semester, semesterNumber, studentID);
  const interestIDs = Users.getProfile(studentID).interestIDs;
  const preferred = new PreferredChoice(choices, interestIDs);
  const best = preferred.getBestChoices();
  if (best) {
    return best[getRandomInt(0, best.length)];
  }
  return null;
};

export const getStudentCurrentSemesterOpportunityChoices = (studentID) => {
  const currentSemester = Semesters.getCurrentSemesterDoc();
  const semesterNum = getStudentsCurrentSemesterNumber(studentID);
  return getStudentSemesterOpportunityChoices(currentSemester, semesterNum, studentID);
};

export const getRecommendedCurrentSemesterOpportunityChoices = (studentID) => {
  const choices = getStudentCurrentSemesterOpportunityChoices(studentID);
  const interestIDs = Users.getProfile(studentID).interestIDs;
  const preferred = new PreferredChoice(choices, interestIDs);
  const best = preferred.getBestChoices();
  return best;
};

export const chooseCurrentSemesterOpportunity = (studentID) => {
  const best = getRecommendedCurrentSemesterOpportunityChoices(studentID);
  if (best) {
    return best[getRandomInt(0, best.length)];
  }
  return null;
};

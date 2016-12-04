import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { SessionState, sessionKeys, updateSessionState } from '../../../startup/client/session-state';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { BS_CS_TEMPLATE, BA_ICS_IT_TEMPLATE } from '../../../api/degree-program/degree-program';
import { generateCoursePlan } from '../../../api/degree-program/plan-generator';
import { Interests } from '../../../api/interest/InterestCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import * as semUtils from '../../../api/semester/SemesterUtilities';
import { Users } from '../../../api/user/UserCollection.js';

Template.Degree_Plan_Generator.helpers({
  userFullName() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      return Users.getFullName(user._id);
    }
    return 'Select a student';
  },
  desiredDegree() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      if (user.desiredDegree === 'BS_CS') {
        return 'B.S. CS';
      } else if (user.desiredDegree === 'BA_ICS') {
        return 'B.A. ICS';
      }
    }
    return '';
  },
  interests() {
    const ret = [];
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      _.map(user.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
      });
    }
    return ret;
  },
  careerGoals() {
    const ret = [];
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      _.map(user.careerGoalIDs, (id) => {
        ret.push(CareerGoals.findDoc(id));
      });
    }
    return ret;
  },
});

Template.Degree_Plan_Generator.events({
  'click .jsGeneratePlan': function clickGeneratePlan(event, instance) {
    event.preventDefault();
    const studentID = SessionState.get(sessionKeys.CURRENT_STUDENT_ID);
    const student = Users.findDoc(studentID);
    let template;
    if (student.desiredDegree === 'BS_CS') {
      template = BS_CS_TEMPLATE;
    }
    if (student.desiredDegree === 'BA_ICS') {
      template = BA_ICS_IT_TEMPLATE;
    }
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const startSemester = semUtils.nextFallSpringSemester(currentSemester);
    console.log(generateCoursePlan(template, startSemester, student));
  },
});

Template.Degree_Plan_Generator.onCreated(function degreePlanGeneratorOnCreated() {
  updateSessionState(SessionState);
});

Template.Degree_Plan_Generator.onRendered(function degreePlanGeneratorOnRendered() {
  // add your statement here
});

Template.Degree_Plan_Generator.onDestroyed(function degreePlanGeneratorOnDestroyed() {
  // add your statement here
});


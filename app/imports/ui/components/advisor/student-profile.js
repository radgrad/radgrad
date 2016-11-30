import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { lodash } from 'meteor/erasaur:meteor-lodash';

import { SessionState, sessionKeys, updateSessionState } from '../../../startup/client/session-state';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Student_Profile.helpers({
  careerGoals() {
    return CareerGoals.find().fetch();
  },
  careerGoalSelected(goal) {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      return lodash.indexOf(user.careerGoalIDs, goal._id) !== -1;
    }
    return false;
  },
  desireBA() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      return user.desiredDegree === 'B.A. ICS';
    }
    return false;
  },
  desireBS() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      return user.desiredDegree === 'B.S. CS';
    }
    return false;
  },
  desiredDegree() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      return user.desiredDegree;
    }
    return 'Select Degree';
  },
  inRole(role) {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      return Roles.userIsInRole(user._id, role.key);
    }
    return false;
  },
  interests() {
    return Interests.find().fetch();
  },
  interestSelected(interest) {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      return lodash.indexOf(user.interestIDs, interest._id) !== -1;
    }
    return false;
  },
  roles() {
    const ret = [];
    const pairs = lodash.toPairs(ROLE);
    pairs.forEach((p) => {
      const keyValue = {};
      if (p[1] !== 'ADMIN') {
        keyValue.key = p[1];
        keyValue.value = lodash.capitalize(p[1]);
        ret.push(keyValue);
      }
    });
    return ret;
  },
  userRole() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
      return lodash.capitalize(Users.getRoles(user._id)[0]);
    }
    return 'Select Role';
  },
});

Template.Student_Profile.events({
  'click .jsDegree': function clickJsInterests(event) {
    event.preventDefault();
    const student = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
    const choice = event.target.parentElement.getElementsByTagName('input')[0].value;
    Users.setDesiredDegree(student._id, choice);
  },
  'click .jsInterests': function clickJsInterests(event) {
    event.preventDefault();
    const student = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
    const interestIDs = [];
    const interestDivs = event.target.parentElement.getElementsByTagName('a');
    lodash.map(interestDivs, (div) => {
      interestIDs.push(div.attributes[1].nodeValue);
    });
    try {
      Users.setInterestIds(student._id, interestIDs);
    } catch (e) {
      // don't do anything.
    }
  },
  'click .jsCareers': function clickJsCareers(event) {
    event.preventDefault();
    const student = Users.findDoc(SessionState.get(sessionKeys.CURRENT_STUDENT_ID));
    const careerIDs = [];
    const interestDivs = event.target.parentElement.getElementsByTagName('a');
    lodash.map(interestDivs, (div) => {
      careerIDs.push(div.attributes[1].nodeValue);
    });
    try {
      Users.setCareerGoalIds(student._id, careerIDs);
    } catch (e) {
      // don't do anything.
    }
  },
});

Template.Student_Profile.onCreated(function studentProfileOnCreated() {
  updateSessionState(SessionState);
});

Template.Student_Profile.onRendered(function studentProfileOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

Template.Student_Profile.onDestroyed(function studentProfileOnDestroyed() {
  // add your statement here
});


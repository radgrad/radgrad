/* global FileReader */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { sessionKeys } from '../../../startup/client/session-state';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import { StarDataLogs } from '../../../api/star/StarDataLogCollection';
// import { StarUploads } from '../../../api/star/StarUploadCollection';
import { Users } from '../../../api/user/UserCollection.js';

// TODO: Remove the sessionKeys stuff.

Template.Student_Profile_Widget.helpers({
  careerGoals() {
    return CareerGoals.find().fetch();
  },
  careerGoalSelected(goal) {
    if (Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID));
      return _.indexOf(user.careerGoalIDs, goal._id) !== -1;
    }
    return false;
  },
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  desireBA() {
    if (Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID));
      return user.desiredDegree === 'BA_ICS';
    }
    return false;
  },
  desireBS() {
    if (Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID));
      return user.desiredDegree === 'BS_CS';
    }
    return false;
  },
  desiredDegree() {
    // TODO: Need to use DesiredDegrees collection, not hard-wire the strings. This won't work now.
    if (Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID));
      if (user.desiredDegree === 'BS_CS') {
        return 'B.S. CS';
      } else if (user.desiredDegree === 'BA_ICS') {
        return 'B.A. ICS';
      }
    }
    return 'Select Desired Degree';
  },
  inRole(role) {
    if (Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID));
      return Roles.userIsInRole(user._id, role.key);
    }
    return false;
  },
  interests() {
    return Interests.find().fetch();
  },
  interestSelected(interest) {
    if (Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID));
      return _.indexOf(user.interestIDs, interest._id) !== -1;
    }
    return false;
  },
  roles() {
    const ret = [];
    const pairs = _.toPairs(ROLE);
    pairs.forEach((p) => {
      const keyValue = {};
      if (p[1] !== 'ADMIN') {
        keyValue.key = p[1];
        keyValue.value = _.capitalize(p[1]);
        ret.push(keyValue);
      }
    });
    return ret;
  },
  starLogs() {
    if (Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const studentID = Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID);
      return StarDataLogs.find({ studentID });
    }
    return null;
  },
  userRole() {
    if (Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const user = Users.findDoc(Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID));
      return _.capitalize(Users.getRoles(user._id)[0]);
    }
    return 'Select Role';
  },
});

Template.Student_Profile_Widget.events({
  'click .jsDegree': function clickJsInterests(event, instance) {
    event.preventDefault();
    const student = Users.findDoc(instance.state.get(sessionKeys.CURRENT_STUDENT_ID));
    const choice = event.target.parentElement.getElementsByTagName('input')[0].value;
    console.log(choice);
    if (choice === 'BS_CS') {
      Users.setDesiredDegree(student._id, 'bs-cs');
    } else {
      Users.setDesiredDegree(student._id, 'ba-ics');
    }
  },
  'click .jsInterests': function clickJsInterests(event, instance) {
    event.preventDefault();
    const student = Users.findDoc(instance.state.get(sessionKeys.CURRENT_STUDENT_ID));
    const interestIDs = [];
    const interestDivs = event.target.parentElement.getElementsByTagName('a');
    _.map(interestDivs, (div) => {
      interestIDs.push(div.attributes[1].nodeValue);
    });
    try {
      Users.setInterestIds(student._id, interestIDs);
    } catch (e) {
      // don't do anything.
    }
  },
  'click .jsCareers': function clickJsCareers(event, instance) {
    event.preventDefault();
    const student = Users.findDoc(instance.state.get(sessionKeys.CURRENT_STUDENT_ID));
    const careerIDs = [];
    const interestDivs = event.target.parentElement.getElementsByTagName('a');
    _.map(interestDivs, (div) => {
      careerIDs.push(div.attributes[1].nodeValue);
    });
    try {
      Users.setCareerGoalIds(student._id, careerIDs);
    } catch (e) {
      // don't do anything.
    }
  },
  'click .jsStarData': function clickJsStarData(event, instance) {
    event.preventDefault();
    const student = Users.findDoc(instance.state.get(sessionKeys.CURRENT_STUDENT_ID));
    const fileName = event.target.parentElement.getElementsByTagName('input')[0];
    if (fileName.files && fileName.files[0]) {
      const starData = fileName.files[0];
      const fr = new FileReader();
      fr.onload = (e) => {
        const csvData = e.target.result;
        Meteor.call('StarProcessor.loadStarCsvData', student.username, csvData);
      };
      fr.readAsText(starData);
    }
  },
});

Template.Student_Profile_Widget.onCreated(function studentProfileOnCreated() {
  this.currentUpload = new ReactiveVar(false);
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  } else {
    this.state = new ReactiveDict();
  }
});

Template.Student_Profile_Widget.onRendered(function studentProfileOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

Template.Student_Profile_Widget.onDestroyed(function studentProfileOnDestroyed() {
  // add your statement here
});


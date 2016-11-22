import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { lodash } from 'meteor/erasaur:meteor-lodash';

import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import { Users } from '../../../api/user/UserCollection.js';

Template.Student_Profile.helpers({
  careerGoals() {
    return CareerGoals.find().fetch();
  },
  desireBA() {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      return user.desiredDegree === 'B.A. ICS';
    }
    return false;
  },
  desireBS() {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      return user.desiredDegree === 'B.S. CS';
    }
    return false;
  },
  inRole(role) {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      return Roles.userIsInRole(user._id, role.key);
    }
    return false;
  },
  interests() {
    return Interests.find().fetch();
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
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const users = Users.find({ uhID }).fetch();
      if (users.length > 0) {
        return lodash.capitalize(Users.getRoles(users[0]._id)[0]);
      }
    }
    return 'Select Role';
  },
});

Template.Student_Profile.events({
  'click .jsDegree': function clickJsInterests(event, instance) {
    event.preventDefault();
    const uhId = instance.state.get('uhId');
    const student = Users.getUserFromUhId(uhId);
    const choice = event.target.parentElement.getElementsByTagName('input')[0].value;
    Users.setDesiredDegree(student._id, choice);
  },
  'click .jsInterests': function clickJsInterests(event, instance) {
    event.preventDefault();
    const uhId = instance.state.get('uhId');
    const student = Users.getUserFromUhId(uhId);
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
  'click .jsCareers': function clickJsCareers(event, instance) {
    event.preventDefault();
    const uhId = instance.state.get('uhId');
    const student = Users.getUserFromUhId(uhId);
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
  this.state = this.data.dictionary;
});

Template.Student_Profile.onRendered(function studentProfileOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});

Template.Student_Profile.onDestroyed(function studentProfileOnDestroyed() {
  // add your statement here
});


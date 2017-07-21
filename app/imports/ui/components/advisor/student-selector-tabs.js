import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ROLE } from '../../../api/role/Role';
import { sessionKeys } from '../../../startup/client/session-state';
import { Users } from '../../../api/user/UserCollection.js';

// /** @module ui/components/advisor/Student_Selector_Tabs */

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Student_Selector_Tabs.onCreated(function studentSelectorTabsOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  } else {
    this.state = new ReactiveDict();
  }
  if (this.data.studentID) {
    this.studentID = this.data.studentID;
  }
  // FormUtils.setupFormWidget(this, addSchema);
  // this.state.set(displaySuccessMessage, false);
  // this.state.set(displayErrorMessages, false);
  // this.context = addSchema.namedContext('Add_Create_Student');
});

Template.Student_Selector_Tabs.onRendered(function studentSelectorTabsOnRendered() {
  this.$('.menu .item').tab();
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
  this.state.set('addNewUser', false);
});

Template.Student_Selector_Tabs.helpers({
  alphabeticalGroups() {
    return ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'];
  },
  isActive(group) {
    if (group === 'ABC') {
      return 'active';
    }
    return '';
  },
  users(role, range) {
    const rangeLength = range.length;
    let regex;
    if (rangeLength === 3) {
      regex = new RegExp(`^${range.substring(0, 1)}|^${range.substring(1, 2)}|^${range.substring(2, 3)}`);
    } else
      if (rangeLength === 4) {
        regex = new RegExp(`^${range.substring(0, 1)}|^${range.substring(1, 2)}|^
        ${range.substring(2, 3)}|^${range.substring(3, 4)}`);
      }
    return Users.findProfilesWithRole(role, { lastName: regex }, { sort: { lastName: 1 } });
  },
  url(user) {
    return `/${user.role.toLowerCase()}/${user.username}/home`;
  },
  name(user, tooltip) {
    const name = `${user.lastName}, ${user.firstName}`;
    if (!tooltip) {
      return name.length > 15 ? `${name.substring(0, 15)}...` : name;
    }
    return name;
  },
  studentRole() {
    return ROLE.STUDENT;
  },
  userFullName() {
    if (Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const userID = Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID);
      return Users.getFullName(userID);
    }
    return 'Select a student';
  },
  studentUsername(user) {
    const name = user.username;
    return name.length > 12 ? `${name.substring(0, 12)}...` : name;
  },
  isUserSelected() {
    return Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID);
  },
  alreadyDefined() {
    return Template.instance().state.get('alreadyDefined');
  },
  notDefined() {
    return Template.instance().state.get('notDefined');
  },
  username() {
    return Template.instance().state.get('username');
  },
});

Template.Student_Selector_Tabs.events({
  'click .jsRetrieve': function clickJSRetrieve(event, instance) {
    event.preventDefault();
    const username = event.target.id;
    instance.state.set('username', username);
    const profile = Users.getProfile(username);
    if (profile) {
      instance.state.set(sessionKeys.CURRENT_STUDENT_USERNAME, username);
      instance.state.set(sessionKeys.CURRENT_STUDENT_ID, profile.userID);
      instance.state.set('notDefined', false);
      instance.studentID.set(profile.userID);
    } else {
      instance.state.set(displaySuccessMessage, false);
      instance.state.set(displayErrorMessages, true);
      instance.state.set('notDefined', true);
    }
  },
});

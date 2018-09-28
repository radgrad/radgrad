import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ROLE } from '../../../api/role/Role';
import { sessionKeys } from '../../../startup/client/session-state';
import { Users } from '../../../api/user/UserCollection.js';

Template.Student_Selector_Tabs.onCreated(function studentSelectorTabsOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  } else {
    this.state = new ReactiveDict();
  }
  if (this.data.studentID) {
    this.studentID = this.data.studentID;
  }
  this.firstNameRegex = this.data.firstNameRegex;
  this.lastNameRegex = this.data.lastNameRegex;
  this.userNameRegex = this.data.userNameRegex;
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
        // eslint-disable-next-line
        regex = new RegExp(`^${range.substring(0, 1)}|^${range.substring(1, 2)}|^${range.substring(2, 3)}|^${range.substring(3, 4)}`);
      }

    const profiles = Users.findProfilesWithRole(role, { lastName: regex }, { sort: { lastName: 1 } });
    regex = RegExp(Template.instance().firstNameRegex.get());
    let filtered = _.filter(profiles, p => regex.test(p.firstName));
    regex = RegExp(Template.instance().lastNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.lastName));
    regex = RegExp(Template.instance().userNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.username));
    return filtered;
  },
  usersCount(role, range) {
    const rangeLength = range.length;
    let regex;
    if (rangeLength === 3) {
      regex = new RegExp(`^${range.substring(0, 1)}|^${range.substring(1, 2)}|^${range.substring(2, 3)}`);
    } else
    if (rangeLength === 4) {
      // eslint-disable-next-line
      regex = new RegExp(`^${range.substring(0, 1)}|^${range.substring(1, 2)}|^${range.substring(2, 3)}|^${range.substring(3, 4)}`);
    }
    const profiles = Users.findProfilesWithRole(role, { lastName: regex }, { sort: { lastName: 1 } });
    regex = RegExp(Template.instance().firstNameRegex.get());
    let filtered = _.filter(profiles, p => regex.test(p.firstName));
    regex = RegExp(Template.instance().lastNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.lastName));
    regex = RegExp(Template.instance().userNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.username));
    return filtered.length;
  },
  name(user, tooltip) {
    const name = `${user.lastName}, ${user.firstName}`;
    if (!tooltip) {
      return name.length > 13 ? `${name.substring(0, 13)}...` : name;
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
  username() {
    return Template.instance().state.get('username');
  },
  level(user) {
    return user.level;
  },
  firstNameRegex() {
    return Template.instance().firstNameRegex;
  },
  lastNameRegex() {
    return Template.instance().lastNameRegex;
  },
  userNameRegex() {
    return Template.instance().userNameRegex;
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
      instance.studentID.set(profile.userID);
    }
  },
  'click .add-new-student': function clickNewStudent(event, instance) {
    event.preventDefault();
    instance.studentID.set('');
  },
});

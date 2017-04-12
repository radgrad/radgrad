import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ROLE } from '../../../api/role/Role';
import { sessionKeys } from '../../../startup/client/session-state';
import { ValidUserAccounts } from '../../../api/user/ValidUserAccountCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { Feeds } from '../../../api/feed/FeedCollection.js';

const userDefineSchema = new SimpleSchema({
  firstName: { type: String },
  lastName: { type: String },
  userName: { type: String },
  uhID: {
    type: String,
    regEx: /\d{4}-\d{4}/, // TODO: Do we care whether there is a dash?
  },
});

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

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
    const regex = new RegExp(`^${range.substring(0, 1)}|^${range.substring(1, 2)}|^${range.substring(2, 3)}`);
    return Users.find({ roles: [role], lastName: regex }, { sort: { lastName: 1 } }).fetch();
  },
  url(user) {
    return `/${user.roles[0].toLowerCase()}/${user.username}/home`;
  },
  name(user, tooltip) {
    const name = `${user.lastName}, ${user.firstName}`;
    if (!tooltip) {
      return name.length > 16 ? `${name.substring(0, 16)}...` : name;
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
  userID() {
    if (Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID)) {
      const userID = Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID);
      const user = Users.findDoc(userID);
      return user.uhID;
    }
    return '1111-1111';
  },
  studentUsername(user) {
    const name = user.username;
    return name.length > 16 ? `${name.substring(0, 16)}...` : name;
  },
  isUserSelected() {
    return Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID);
  },
  addNewUser() {
    return Template.instance().state.get('addNewUser');
  },
  alreadyDefined() {
    return Template.instance().state.get('alreadyDefined');
  },
  badUsername() {
    return Template.instance().state.get('badUsername');
  },
  otherError() {
    return Template.instance().state.get('otherError');
  },
  errorMessage() {
    return Template.instance().state.get('errorMessage');
  },
  notDefined() {
    return Template.instance().state.get('notDefined');
  },
  username() {
    return Template.instance().state.get('username');
  },
  successClass() {
    return Template.instance().state.get(displaySuccessMessage) ? 'success' : '';
  },
  errorClass() {
    return Template.instance().state.get(displayErrorMessages) ? 'error' : '';
  },
  displayFieldError(fieldName) {
    const errorKeys = Template.instance().context.invalidKeys();
    return _.find(errorKeys, (keyObj) => keyObj.name === fieldName);
  },
  fieldErrorMessage(fieldName) {
    return Template.instance().context.keyErrorMessage(fieldName);
  },
});

Template.Student_Selector_Tabs.events({
  'click .jsRetrieve': function clickJSRetrieve(event, instance) {
    event.preventDefault();
    const username = event.target.id;
    instance.state.set('username', username);
    const user = Users.getUserFromUsername(username);
    if (user) {
      instance.state.set(sessionKeys.CURRENT_STUDENT_USERNAME, username);
      instance.state.set(sessionKeys.CURRENT_STUDENT_ID, user._id);
      instance.state.set('notDefined', false);
      instance.studentID.set(user._id);
    } else {
      instance.state.set(displaySuccessMessage, false);
      instance.state.set(displayErrorMessages, true);
      instance.state.set('notDefined', true);
    }
  },
  'click .jsAddNewStudent': function clickJSRetrieve(event, instance) {
    event.preventDefault();
    instance.state.set('addNewUser', true);
  },
  'click .jsCancelAdd': function clickJSCancelAdd(event, instance) {
    event.preventDefault();
    instance.state.set('addNewUser', false);
  },
  'submit .jsNewStudent': function submitNewUser(event, instance) {
    event.preventDefault();
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const userName = event.target.username.value;
    let uhID = event.target.uhID.value;
    if (uhID.length > 0 && uhID.indexOf('-') === -1) {
      uhID = `${uhID.substring(0, 4)}-${uhID.substring(4, 8)}`;
    }
    const newStudentData = { firstName, lastName, userName, uhID };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newStudentData reflects what will be defined
    userDefineSchema.clean(newStudentData);
    // Determine validity
    instance.context.validate(newStudentData);
    if (instance.context.isValid()) {
      const notDefined = Users.find({ username: userName }).count() === 0;
      if (notDefined) {
        ValidUserAccounts.define({ username: userName });
        const userDefinition = {
          firstName,
          lastName,
          slug: userName,
          email: `${userName}@hawaii.edu`,
          role: ROLE.STUDENT,
          uhID,
        };
        const studentID = Meteor.call('Users.define', userDefinition, (error) => {
          if (error) {
            const regexp = /^[a-zA-Z0-9-_]+$/;
            if (userName.search(regexp) === -1) {
              instance.state.set(displaySuccessMessage, false);
              instance.state.set(displayErrorMessages, true);
              instance.state.set('alreadyDefined', false);
              instance.state.set('badUsername', true);
            } else {
              instance.state.set(displaySuccessMessage, false);
              instance.state.set(displayErrorMessages, true);
              instance.state.set('otherError', true);
              instance.state.set('errorMessage', error.reason);
            }
          } else {
            const timestamp = new Date().getTime();
            if (Feeds.checkPastDayFeed(timestamp, 'new-user')) {
              Feeds.updateNewUser(userName, Feeds.checkPastDayFeed(timestamp, 'new-user'));
            } else {
              const feedDefinition = {
                user: [userName],
                feedType: 'new-user',
                timestamp,
              };
              Feeds.define(feedDefinition);
            }
            const user = Users.getUserFromUsername(userName);
            instance.studentID.set(user._id);
            instance.state.set(sessionKeys.CURRENT_STUDENT_USERNAME, userName);
            instance.state.set(sessionKeys.CURRENT_STUDENT_ID, user._id);
            instance.state.set('notDefined', false);
            instance.state.set(displaySuccessMessage, userName);
            instance.state.set(displayErrorMessages, false);
            instance.state.set('addNewUser', false);
          }
        });
        const user = Users.getUserFromUsername(userName);
        instance.state.set(sessionKeys.CURRENT_STUDENT_USERNAME, userName);
        instance.state.set(sessionKeys.CURRENT_STUDENT_ID, studentID);
      } else {
        instance.state.set(displaySuccessMessage, false);
        instance.state.set(displayErrorMessages, true);
        instance.state.set('badUsername', false);
        instance.state.set('alreadyDefined', true);
        instance.state.set('username', userName);
      }
    } else {
      instance.state.set(displaySuccessMessage, false);
      instance.state.set(displayErrorMessages, true);
    }
  },
});

Template.Student_Selector_Tabs.onCreated(function studentSelectorTabsOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  } else {
    this.state = new ReactiveDict();
  }
  if (this.data.studentID) {
    this.studentID = this.data.studentID;
  }
  this.state.set(displaySuccessMessage, false);
  this.state.set(displayErrorMessages, false);
  this.context = userDefineSchema.namedContext('Add_Create_Student');
});

Template.Student_Selector_Tabs.onRendered(function studentSelectorTabsOnRendered() {
  this.$('.menu .item').tab();
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
  this.state.set('addNewUser', false);
});

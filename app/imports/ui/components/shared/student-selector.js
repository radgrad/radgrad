import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

import { AdminChoices } from '../../../api/admin/AdminChoiceCollection';
import { ROLE } from '../../../api/role/Role';
import { SessionState, sessionKeys } from '../../../startup/client/session-state';
import { ValidUserAccounts } from '../../../api/user/ValidUserAccountCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { defineUser } from '../../../api/user/methods';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';


Template.Student_Selector.helpers({
  userFullName() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_USERNAME)) {
      const username = SessionState.get(sessionKeys.CURRENT_STUDENT_USERNAME);
      const user = Users.getUserFromUsername(username);
      return Users.getFullName(user._id);
    }
    return 'Select a student';
  },
  userID() {
    if (SessionState.get(sessionKeys.CURRENT_STUDENT_USERNAME)) {
      const username = SessionState.get(sessionKeys.CURRENT_STUDENT_USERNAME);
      const user = Users.getUserFromUsername(username);
      return user.uhID;
    }
    return '1111-1111';
  },
  isUserSelected() {
    return SessionState.get(sessionKeys.CURRENT_STUDENT_USERNAME);
  },
  addNewUser() {
    return Template.instance().state.get('addNewUser');
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
  successClass() {
    return Template.instance().state.get(displaySuccessMessage) ? 'success' : '';
  },
  errorClass() {
    return Template.instance().state.get(displayErrorMessages) ? 'error' : '';
  },
});

Template.Student_Selector.events({
  'submit .jsRetrieve': function clickJSRetrieve(event, instance) {
    event.preventDefault();
    const username = event.target.username.value;
    instance.state.set('username', username);
    const user = Users.getUserFromUsername(username);
    if (user) {
      const adminID = Meteor.userId();
      if (AdminChoices.find({ adminID: Meteor.userId() }).count() === 1) {
        const adminChoice = AdminChoices.find({ adminID }).fetch()[0];
        AdminChoices.updateUsername(adminChoice._id, username);
        AdminChoices.updateStudentID(adminChoice._id, user._id);
      }
      SessionState.set(sessionKeys.CURRENT_STUDENT_USERNAME, username);
      instance.state.set(sessionKeys.CURRENT_STUDENT_USERNAME, username);
      SessionState.set(sessionKeys.CURRENT_STUDENT_ID, user._id);
      instance.state.set(sessionKeys.CURRENT_STUDENT_ID, user._id);
      instance.state.set('notDefined', false);
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
  'submit .jsNewStudent': function submitNewUser(event, instance) {
    event.preventDefault();
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const username = event.target.username.value;
    let uhID = event.target.uhID.value;
    if (uhID.indexOf('-') === -1) {
      uhID = `${uhID.substring(0, 4)}-${uhID.substring(4, 8)}`;
    }
    const notDefined = Users.find({ username }).count() === 0;
    if (notDefined) {
      ValidUserAccounts.define({ username });
      const userDefinition = {
        firstName,
        lastName,
        slug: username,
        email: `${username}@hawaii.edu`,
        role: ROLE.STUDENT,
        uhID,
      };
      const studentID = Meteor.call('Users.define', userDefinition, (error) => {
        if (error) {
          // console.log(error);
        }
      });
      SessionState.set(sessionKeys.CURRENT_STUDENT_USERNAME, username);
      instance.state.set(sessionKeys.CURRENT_STUDENT_USERNAME, username);
      SessionState.set(sessionKeys.CURRENT_STUDENT_ID, studentID);
      instance.state.set(sessionKeys.CURRENT_STUDENT_ID, studentID);
      instance.state.set('notDefined', false);
      instance.state.set(displaySuccessMessage, username);
      instance.state.set(displayErrorMessages, false);
      instance.state.set('addNewUser', false);
    } else {
      instance.state.set(displaySuccessMessage, false);
      instance.state.set(displayErrorMessages, true);
      instance.state.set('alreadyDefined', true);
      instance.state.set('username', username);
    }
  },
});

Template.Student_Selector.onCreated(function studentSelectorOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  } else {
    this.state = new ReactiveDict();
    const adminID = Meteor.userId();
    if (AdminChoices.find({ adminID }).count() === 1) {
      const adminChoice = AdminChoices.find({ adminID }).fetch()[0];
      this.state.set(sessionKeys.CURRENT_STUDENT_USERNAME, adminChoice.username);
      this.state.set(sessionKeys.CURRENT_STUDENT_ID, adminChoice.studentID);
    }
  }
  this.state.set(displaySuccessMessage, false);
  this.state.set(displayErrorMessages, false);
});

Template.Student_Selector.onRendered(function studentSelectorOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
  this.state.set('addNewUser', false);
});

Template.Student_Selector.onDestroyed(function studentSelectorOnDestroyed() {
  // add your statement here
});


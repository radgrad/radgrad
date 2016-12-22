/**
 * Created by Cam Moore on 12/21/16.
 */
import { ReactiveDict } from 'meteor/reactive-dict';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Template } from 'meteor/templating';
import { sessionKeys } from '../../../startup/client/session-state';
import { Users } from '../../../api/user/UserCollection';
import { lodash } from 'meteor/erasaur:meteor-lodash';

const userDefineSchema = new SimpleSchema({
  firstName: { type: String },
  lastName: { type: String },
  userName: { type: String },
  uhID: {
    type: String,
    regEx: /\d{4}-\d{4}/,
  },
});

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Add_Student_Widget.helpers({
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
  isUserSelected() {
    return Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID);
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
  displayFieldError(fieldName) {
    const errorKeys = Template.instance().context.invalidKeys();
    return lodash.find(errorKeys, (keyObj) => keyObj.name === fieldName);
  },
  fieldErrorMessage(fieldName) {
    return Template.instance().context.keyErrorMessage(fieldName);
  },
});

Template.Add_Student_Widget.events({
  // add your events here
});

Template.Add_Student_Widget.onCreated(function addStudentWidgetOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  } else {
    this.state = new ReactiveDict();
  }
  this.state.set(displaySuccessMessage, false);
  this.state.set(displayErrorMessages, false);
  this.context = userDefineSchema.namedContext('Add_Create_Student');
});

Template.Add_Student_Widget.onRendered(function addStudentWidgetOnRendered() {
  // add your statement here
});

Template.Add_Student_Widget.onDestroyed(function addStudentWidgetOnDestroyed() {
  // add your statement here
});


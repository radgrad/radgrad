/**
 * Created by Cam Moore on 12/21/16.
 */
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Template } from 'meteor/templating';
import { sessionKeys } from '../../../startup/client/session-state';
import { ROLE } from '../../../api/role/Role';
import { ValidUserAccounts } from '../../../api/user/ValidUserAccountCollection';
import { Users } from '../../../api/user/UserCollection';
import { lodash } from 'meteor/erasaur:meteor-lodash';

const userDefineSchema = new SimpleSchema({
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String },
  uhID: {
    type: String,
    regEx: /\d{4}-\d{4}/,
  },
});

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Add_Student_Widget.helpers({
  displayFieldError(fieldName) {
    const errorKeys = Template.instance().context.invalidKeys();
    return lodash.find(errorKeys, (keyObj) => keyObj.name === fieldName);
  },
  displaySuccessMessage() {
    return Template.instance().state.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().state.get(displayErrorMessages) ? 'error' : '';
  },
  fieldErrorMessage(fieldName) {
    return Template.instance().context.keyErrorMessage(fieldName);
  },
  isUserSelected() {
    return Template.instance().state.get(sessionKeys.CURRENT_STUDENT_ID);
  },
  notDefined() {
    return Template.instance().state.get('notDefined');
  },
  successClass() {
    return Template.instance().state.get(displaySuccessMessage) ? 'success' : '';
  },
  uhIdAlreadyDefined() {
    return Template.instance().state.get('uhIdAlreadyDefined');
  },
  uhID() {
    return Template.instance().state.get('uhID');
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
  username() {
    return Template.instance().state.get('username');
  },
  usernameAlreadyDefined() {
    return Template.instance().state.get('usernameAlreadyDefined');
  },
});

Template.Add_Student_Widget.events({
  'submit .jsNewStudent': function submitNewUser(event, instance) {
    event.preventDefault();
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const username = event.target.username.value;
    let uhID = event.target.uhID.value;
    if (uhID.length > 0 && uhID.indexOf('-') === -1) {
      uhID = `${uhID.substring(0, 4)}-${uhID.substring(4, 8)}`;
    }
    const newStudentData = { firstName, lastName, username, uhID };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newStudentData reflects what will be defined
    userDefineSchema.clean(newStudentData);
    // Determine validity
    instance.context.validate(newStudentData);
    if (instance.context.isValid()) {
      const usernameNotDefined = Users.find({ username }).count() === 0;
      const uhIdNotDefined = Users.find({ uhID }).count() === 0;
      if (usernameNotDefined && uhIdNotDefined) {
        ValidUserAccounts.define({ username });
        // TODO: CAM remove the password when we go to CAS.
        const userDefinition = {
          firstName,
          lastName,
          slug: username,
          email: `${username}@hawaii.edu`,
          role: ROLE.STUDENT,
          uhID,
          password: 'foo',
        };
        const studentID = Meteor.call('Users.define', userDefinition, (error) => {
          if (error) {
            // console.log(error);
          }
        });
        instance.state.set(sessionKeys.CURRENT_STUDENT_USERNAME, username);
        instance.state.set(sessionKeys.CURRENT_STUDENT_ID, studentID);
        instance.state.set('notDefined', false);
        instance.state.set(displaySuccessMessage, username);
        instance.state.set(displayErrorMessages, false);
        instance.state.set('addNewUser', false);
      } else {
        if (!usernameNotDefined) {
          instance.state.set(displaySuccessMessage, false);
          instance.state.set(displayErrorMessages, true);
          instance.state.set('usernameAlreadyDefined', true);
          instance.state.set('username', username);
        }
        if (!uhIdNotDefined) {
          instance.state.set(displaySuccessMessage, false);
          instance.state.set(displayErrorMessages, true);
          instance.state.set('uhIdAlreadyDefined', true);
          instance.state.set('uhID', uhID);
        }
      }
    } else {
      instance.state.set(displaySuccessMessage, false);
      instance.state.set(displayErrorMessages, true);
    }
  },
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


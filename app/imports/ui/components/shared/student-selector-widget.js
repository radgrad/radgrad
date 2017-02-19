import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { lodash } from 'meteor/erasaur:meteor-lodash';
import { ROLE } from '../../../api/role/Role';
import { sessionKeys } from '../../../startup/client/session-state';
import { ValidUserAccounts } from '../../../api/user/ValidUserAccountCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { Feed } from '../../../api/feed/FeedCollection.js';

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

Template.Student_Selector_Widget.helpers({
  users(role) {
    return Users.find({ roles: [role] }, { sort: { lastName: 1 } });
  },
  url(user) {
    return `/${user.roles[0].toLowerCase()}/${user.username}/home`;
  },
  label(user) {
    return `${user.lastName}, ${user.firstName} (${user.username})`;
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

Template.Student_Selector_Widget.events({
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
            // console.log(error);
          } else {
            const feedDefinition = {
              student: userName,
              feedType: 'new',
              timestamp: new Date().getTime(),
            };
            Feed.define(feedDefinition);
            const user = Users.getUserFromUsername(userName);
            instance.studentID.set(user._id);
            instance.state.set(sessionKeys.CURRENT_STUDENT_USERNAME, userName);
            instance.state.set(sessionKeys.CURRENT_STUDENT_ID, user._id);
          }
        });

        instance.state.set(sessionKeys.CURRENT_STUDENT_USERNAME, userName);
        instance.state.set(sessionKeys.CURRENT_STUDENT_ID, studentID);
        instance.state.set('notDefined', false);
        instance.state.set(displaySuccessMessage, userName);
        instance.state.set(displayErrorMessages, false);
        instance.state.set('addNewUser', false);
      } else {
        instance.state.set(displaySuccessMessage, false);
        instance.state.set(displayErrorMessages, true);
        instance.state.set('alreadyDefined', true);
        instance.state.set('username', userName);
      }
    } else {
      instance.state.set(displaySuccessMessage, false);
      instance.state.set(displayErrorMessages, true);
    }
  },
});

Template.Student_Selector_Widget.onCreated(function studentSelectorOnCreated() {
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
  this.subscribe(Users.getPublicationName());
});

Template.Student_Selector_Widget.onRendered(function studentSelectorOnRendered() {
  this.$('.menu .item').tab();
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
  this.state.set('addNewUser', false);
});

Template.Student_Selector_Widget.onDestroyed(function studentSelectorOnDestroyed() {
  // add your statement here
});


import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ROLE } from '../../../api/role/Role';
import { sessionKeys } from '../../../startup/client/session-state';
import { Users } from '../../../api/user/UserCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';
import { getRouteUserName } from '../shared/route-user-name';
import { appLog } from '../../../api/log/AppLogCollection';

// /** @module ui/components/advisor/Student_Selector_Tabs */
const formSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  slug: { type: String, custom: FormUtils.slugFieldValidator },
  email: String,
});

// TODO Fix for new user management.
const addSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  role: String,
  slug: { type: String, custom: FormUtils.slugFieldValidator },
  email: String,
  // Everything else is optional.
  uhID: { type: String, optional: true },
  interests: { type: Array, optional: true }, 'interests.$': String,
  password: { type: String, optional: true },
  picture: { type: String, optional: true },
  level: { type: Number, optional: true },
  careerGoals: { type: Array }, 'careerGoals.$': String,
  website: { type: String, optional: true },
  declaredSemester: { type: String, optional: true },
}, { tracker: Tracker });

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
  FormUtils.setupFormWidget(this, addSchema);
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
    // TODO Get rid of UH ID.
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
    const errorKeys = Template.instance().context.validationErrors();
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
  'click .jsAddNewStudent': function clickJSRetrieve(event, instance) {
    event.preventDefault();
    instance.state.set('addNewUser', true);
  },
  'click .jsCancelAdd': function clickJSCancelAdd(event, instance) {
    event.preventDefault();
    instance.state.set('addNewUser', false);
  },
  'submit .jsNewStudent': function submitNewUser(event, instance) {
    // TODO Fix this method for new user management
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(formSchema, event);
    instance.context.reset();
    newData.role = ROLE.STUDENT;
    newData.password = 'foo';
    newData.uhID = '';
    newData.level = 1;
    newData.declaredSemester = Semesters.getSlug(Semesters.getCurrentSemester());
    newData.interests = [];
    newData.careerGoals = [];
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      defineMethod.call({ collectionName: 'StudentProfileCollection', definitionData: newData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          const feedData = { feedType: 'new-user', user: newData.slug };
          defineMethod.call({ collectionName: 'FeedCollection', definitionData: feedData });
          FormUtils.indicateSuccess(instance, event);
          const advisor = getRouteUserName();
          const message = `${advisor} created student ${newData.slug}`;
          appLog.info(message);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
    // const firstName = event.target.firstName.value;
    // const lastName = event.target.lastName.value;
    // const userName = event.target.username.value;
    // let uhID = event.target.uhID.value;
    // if (uhID.length > 0 && uhID.indexOf('-') === -1) {
    //   uhID = `${uhID.substring(0, 4)}-${uhID.substring(4, 8)}`;
    // }
    // const newStudentData = { firstName, lastName, userName, uhID };
    // // Clear out any old validation errors.
    // instance.context.reset();
    // // Invoke clean so that newStudentData reflects what will be defined
    // userDefineSchema.clean(newStudentData);
    // // Determine validity
    // instance.context.validate(newStudentData);
    // if (instance.context.isValid()) {
    //   const notDefined = Users.find({ username: userName }).count() === 0;
    //   if (notDefined) {
    //     validUserAccountsDefineMethod.call({ username: userName }, (error) => {
    //       if (error) {
    //         console.log('Error during new user creation ValidUserAccounts: ', error);
    //         instance.state.set(displaySuccessMessage, false);
    //         instance.state.set(displayErrorMessages, true);
    //         instance.state.set('errorMessage', error.reason);
    //       }
    //     });
    //     const userDefinition = { firstName, lastName, slug: userName, email: `${userName}@hawaii.edu`,
    //       role: ROLE.STUDENT, uhID };
    //     defineMethod.call({ collectionName: 'UserCollection', definitionData: userDefinition }, (error) => {
    //       if (error) {
    //         const regexp = /^[a-zA-Z0-9-_]+$/;
    //         if (userName.search(regexp) === -1) {
    //           instance.state.set(displaySuccessMessage, false);
    //           instance.state.set(displayErrorMessages, true);
    //           instance.state.set('alreadyDefined', false);
    //           instance.state.set('badUsername', true);
    //           instance.state.set('errorMessage', error.reason);
    //         } else {
    //           instance.state.set(displaySuccessMessage, false);
    //           instance.state.set(displayErrorMessages, true);
    //           instance.state.set('otherError', true);
    //           instance.state.set('errorMessage', error.reason);
    //         }
    //       } else {
    //         const feedData = { feedType: 'new-user', user: userName };
    //         defineMethod.call({ collectionName: 'FeedCollection', definitionData: feedData });
    //         const user = Users.getUserFromUsername(userName);
    //         instance.studentID.set(user._id);
    //         instance.state.set(sessionKeys.CURRENT_STUDENT_USERNAME, userName);
    //         instance.state.set(sessionKeys.CURRENT_STUDENT_ID, user._id);
    //         instance.state.set('notDefined', false);
    //         instance.state.set(displaySuccessMessage, userName);
    //         instance.state.set(displayErrorMessages, false);
    //         instance.state.set('addNewUser', false);
    //       }
    //     });
    //   } else {
    //     instance.state.set(displaySuccessMessage, false);
    //     instance.state.set(displayErrorMessages, true);
    //     instance.state.set('badUsername', false);
    //     instance.state.set('alreadyDefined', true);
    //     instance.state.set('username', userName);
    //   }
    // } else {
    //   instance.state.set(displaySuccessMessage, false);
    //   instance.state.set(displayErrorMessages, true);
    // }
  },
});

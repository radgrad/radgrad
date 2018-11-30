import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { ROLE } from '../../../api/role/Role.js';
import { Users } from '../../../api/user/UserCollection.js';
import { updateAllStudentLevelsMethod } from '../../../api/level/LevelProcessor.methods';

Template.Retrieve_User_Widget.onCreated(function retrieveUserOnCreated() {
  this.firstNameRegex = new ReactiveVar();
  this.lastNameRegex = new ReactiveVar();
  this.userNameRegex = new ReactiveVar();
  this.updateResult = new ReactiveVar();
});

Template.Retrieve_User_Widget.helpers({
  users(role) {
    return Users.findProfilesWithRole(role, {}, { sort: { lastName: 1 } });
  },
  url(user) {
    return `/${user.role.toLowerCase()}/${user.username}/home`;
  },
  label(user) {
    return `${user.lastName}, ${user.firstName}`;
  },
  studentRole() {
    return ROLE.STUDENT;
  },
  mentorRole() {
    return ROLE.MENTOR;
  },
  advisorRole() {
    return ROLE.ADVISOR;
  },
  facultyRole() {
    return ROLE.FACULTY;
  },
  studentCount() {
    return Users.findProfilesWithRole(ROLE.STUDENT, {}, { sort: { lastName: 1 } }).length;
  },
  mentorCount() {
    return Users.findProfilesWithRole(ROLE.MENTOR, {}, { sort: { lastName: 1 } }).length;
  },
  facultyCount() {
    return Users.findProfilesWithRole(ROLE.FACULTY, {}, { sort: { lastName: 1 } }).length;
  },
  advisorCount() {
    return Users.findProfilesWithRole(ROLE.ADVISOR, {}, { sort: { lastName: 1 } }).length;
  },
  updateResult() {
    return Template.instance().updateResult.get();
  },
});

Template.Retrieve_User_Widget.events({
  'click .ui.button': function clickUpdateLevels(event, instance) {
    event.preventDefault();
    updateAllStudentLevelsMethod.call((error, result) => {
      if (error) {
        console.log('There was an error updating the student levels', error);
      }
      console.log(result);
      instance.updateResult.set(result);
    });
  },
});

Template.Retrieve_User_Widget.onRendered(function advisorLogViewerOnRendered() {
  this.$('.menu .item').tab();
});

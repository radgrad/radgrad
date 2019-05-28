import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { ROLE } from '../../../api/role/Role.js';
import { Users } from '../../../api/user/UserCollection.js';
import { updateAllStudentLevelsMethod } from '../../../api/level/LevelProcessor.methods';
import { updateStudentSharingInfoMethod } from '../../../api/user/StudentProfileCollection.methods';

Template.Retrieve_User_Widget.onCreated(function retrieveUserOnCreated() {
  this.firstNameRegex = new ReactiveVar();
  this.lastNameRegex = new ReactiveVar();
  this.userNameRegex = new ReactiveVar();
  this.updateResult = new ReactiveVar();
});

Template.Retrieve_User_Widget.helpers({
  users(role) {
    const profiles = Users.findProfilesWithRole(role, {}, { sort: { lastName: 1 } });
    let regex = RegExp(Template.instance().firstNameRegex.get());
    let filtered = _.filter(profiles, p => regex.test(p.firstName));
    regex = RegExp(Template.instance().lastNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.lastName));
    regex = RegExp(Template.instance().userNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.username));
    return filtered;
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
  alumniRole() {
    return ROLE.ALUMNI;
  },
  studentCount() {
    const profiles = Users.findProfilesWithRole(ROLE.STUDENT, {}, { sort: { lastName: 1 } });
    let regex = RegExp(Template.instance().firstNameRegex.get());
    let filtered = _.filter(profiles, p => regex.test(p.firstName));
    regex = RegExp(Template.instance().lastNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.lastName));
    regex = RegExp(Template.instance().userNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.username));
    return filtered.length;
  },
  mentorCount() {
    const profiles = Users.findProfilesWithRole(ROLE.MENTOR, {}, { sort: { lastName: 1 } });
    let regex = RegExp(Template.instance().firstNameRegex.get());
    let filtered = _.filter(profiles, p => regex.test(p.firstName));
    regex = RegExp(Template.instance().lastNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.lastName));
    regex = RegExp(Template.instance().userNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.username));
    return filtered.length;
  },
  facultyCount() {
    const profiles = Users.findProfilesWithRole(ROLE.FACULTY, {}, { sort: { lastName: 1 } });
    let regex = RegExp(Template.instance().firstNameRegex.get());
    let filtered = _.filter(profiles, p => regex.test(p.firstName));
    regex = RegExp(Template.instance().lastNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.lastName));
    regex = RegExp(Template.instance().userNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.username));
    return filtered.length;
  },
  advisorCount() {
    const profiles = Users.findProfilesWithRole(ROLE.ADVISOR, {}, { sort: { lastName: 1 } });
    let regex = RegExp(Template.instance().firstNameRegex.get());
    let filtered = _.filter(profiles, p => regex.test(p.firstName));
    regex = RegExp(Template.instance().lastNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.lastName));
    regex = RegExp(Template.instance().userNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.username));
    return filtered.length;
  },
  alumniCount() {
    const profiles = Users.findProfilesWithRole(ROLE.ALUMNI, {}, { sort: { lastName: 1 } });
    let regex = RegExp(Template.instance().firstNameRegex.get());
    let filtered = _.filter(profiles, p => regex.test(p.firstName));
    regex = RegExp(Template.instance().lastNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.lastName));
    regex = RegExp(Template.instance().userNameRegex.get());
    filtered = _.filter(filtered, p => regex.test(p.username));
    return filtered.length;
  },
  updateResult() {
    return Template.instance().updateResult.get();
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

Template.Retrieve_User_Widget.events({
  'click .jsUpdateLevel': function clickUpdateLevels(event, instance) {
    event.preventDefault();
    updateAllStudentLevelsMethod.call((error, result) => {
      if (error) {
        console.log('There was an error updating the student levels', error);
      }
      console.log(result);
      instance.updateResult.set(result);
    });
  },
  'click .jsUpdateSharePicture': function clickUpdateSharePicture(event, instance) {
    event.preventDefault();
    updateStudentSharingInfoMethod.call({}, (error, result) => {
      if (error) {
        console.error('There was an error updating student sharing.', error);
      }
      console.log(result);
      instance.updateResult.set(result);
    });
  },
});

Template.Retrieve_User_Widget.onRendered(function advisorLogViewerOnRendered() {
  this.$('.menu .item').tab();
});

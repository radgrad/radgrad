import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';
import { updateAllStudentLevelsMethod } from '../../../api/level/LevelProcessor.methods';

// /** @module ui/components/admin/Retrieve_User_Widget */

Template.Retrieve_User_Widget.helpers({
  users(role) {
    return Users.findProfilesWithRole(role, {}, { sort: { lastName: 1 } });
  },
  url(user) {
    return `/${user.roles[0].toLowerCase()}/${user.username}/home`;
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
  adminRole() {
    return ROLE.ADMIN;
  },
  facultyRole() {
    return ROLE.FACULTY;
  },
  alumniRole() {
    return ROLE.ALUMNI;
  },
});

Template.Retrieve_User_Widget.events({
  'click .ui.button': function clickUpdateLevels(event) {
    event.preventDefault();
    updateAllStudentLevelsMethod.call();
  },
});

Template.Retrieve_User_Widget.onRendered(function advisorLogViewerOnRendered() {
  this.$('.menu .item').tab();
});

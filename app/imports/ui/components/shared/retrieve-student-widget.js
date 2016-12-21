import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';

Template.Retrieve_Student_Widget.helpers({
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
  alumniRole() {
    return ROLE.ALUMNI;
  },
});

Template.Retrieve_Student_Widget.events({
  // add your events here
});

Template.Retrieve_Student_Widget.onCreated(function advisorLogViewerOnCreated() {
  this.subscribe(Users.getPublicationName());
});

Template.Retrieve_Student_Widget.onRendered(function advisorLogViewerOnRendered() {
  this.$('.menu .item').tab();
});

Template.Retrieve_Student_Widget.onDestroyed(function advisorLogViewerOnDestroyed() {
  // add your statement here
});


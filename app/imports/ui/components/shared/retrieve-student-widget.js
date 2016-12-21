import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection.js';
import { ROLE } from '../../../api/role/Role.js';

Template.Retrieve_Student_Widget.helpers({
  students() {
    return Users.find({ roles: [ROLE.STUDENT] }, { sort: { lastName: 1 } });
    // return Users.find();
  },
  url(student) {
    return `/student/${student.username}/home`;
  },
  label(student) {
    return `${student.lastName}, ${student.firstName} (${student.username})`;
  },
});

Template.Retrieve_Student_Widget.events({
  // add your events here
});

Template.Retrieve_Student_Widget.onCreated(function advisorLogViewerOnCreated() {
  this.subscribe(Users.getPublicationName());
});

Template.Retrieve_Student_Widget.onRendered(function advisorLogViewerOnRendered() {
  // add your statement here
});

Template.Retrieve_Student_Widget.onDestroyed(function advisorLogViewerOnDestroyed() {
  // add your statement here
});


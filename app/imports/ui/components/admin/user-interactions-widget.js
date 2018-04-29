import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { moment } from 'meteor/momentjs:moment';
import { Users } from '../../../api/user/UserCollection.js';
import { UserInteractions } from '../../../api/analytics/UserInteractionCollection';
import { ROLE } from '../../../api/role/Role.js';

Template.User_Interactions_Widget.onCreated(function userInteractionWidgetOnCreated() {
  this.subscribe(UserInteractions.getPublicationName());
  this.selectedUserID = new ReactiveVar('');
});

Template.User_Interactions_Widget.helpers({
  users(role) {
    return Users.findProfilesWithRole(role, {}, { sort: { lastName: 1 } });
  },
  label(user) {
    return `${user.lastName}, ${user.firstName}`;
  },
  studentRole() {
    return ROLE.STUDENT;
  },
  interactions() {
    const userID = Template.instance().selectedUserID.get();
    return UserInteractions.find({ userID: userID }, { sort: { timestamp: -1 } });
  },
  formatDate(date) {
    return moment(date).format('MM/DD/YY HH:mm');
  },
});

Template.User_Interactions_Widget.events({
  'click .ui.button': function retrieveUserInteraction(event, instance) {
    event.preventDefault();
    instance.selectedUserID.set(event.target.value);
  },
});

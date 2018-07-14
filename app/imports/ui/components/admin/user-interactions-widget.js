import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { moment } from 'meteor/momentjs:moment';
import { Users } from '../../../api/user/UserCollection.js';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { ROLE } from '../../../api/role/Role.js';

Template.User_Interactions_Widget.onCreated(function userInteractionWidgetOnCreated() {
  this.selectedUsername = new ReactiveVar('');
  this.interactions = new ReactiveVar('');
});

Template.User_Interactions_Widget.helpers({
  name() {
    const user = Template.instance().selectedUsername.get();
    if (user === '') {
      return 'NO USER SELECTED';
    }
    const name = Users.getFullName(user);
    return name.toUpperCase();
  },
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
    return Template.instance().interactions.get();
  },
  formatDate(date) {
    return moment(date).format('MM/DD/YY HH:mm');
  },
});

Template.User_Interactions_Widget.events({
  'click .ui.button': function retrieveUserInteraction(event, instance) {
    event.preventDefault();
    instance.selectedUsername.set(event.target.value);
    const selector = { username: event.target.value };
    const options = { sort: { timestamp: -1 } };
    userInteractionFindMethod.call({ selector, options }, (error, result) => {
      if (error) {
        console.log('Error finding user interactions.', error);
      } else {
        instance.interactions.set(result);
      }
    });
  },
});

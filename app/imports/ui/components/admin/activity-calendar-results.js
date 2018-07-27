import { moment } from 'meteor/momentjs:moment';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';

Template.Activity_Calendar_Results.onCreated(function activityCalendarResultsOnCreated() {
  this.activeUsers = new ReactiveDict();
});

Template.Activity_Calendar_Results.onRendered(function activityCalendarResultsOnRendered() {
  const selectedDay = `${this.data.day} ${this.data.month}`; // month also contains the year
  const startOfDay = new Date(moment(selectedDay, 'DD MMMM YYYY').startOf('day'));
  const endOfDay = new Date(moment(selectedDay, 'DD MMMM YYYY').endOf('day'));
  const instance = this;
  _.each(this.data.userList, function (users, role) {
    const selector = {
      username: { $in: users },
      timestamp: { $gte: startOfDay, $lte: endOfDay },
    };
    userInteractionFindMethod.call({ selector }, (error, result) => {
      if (error) {
        console.log('Error finding user interactions.', error);
      } else {
        const roleResults = {};
        roleResults.role = role;
        roleResults.users = _.uniq(_.map(result, 'username'));
        roleResults.userCount = roleResults.users.length;
        roleResults.interactionCount = result.length;
        instance.activeUsers.set(role, roleResults);
      }
    });
  });
});

Template.Activity_Calendar_Results.helpers({
  dayOfMonth(day) {
    return day !== '';
  },
  roles() {
    const temp = [];
    _.each(Template.instance().activeUsers.all(), function (results, role) {
      if (role) {
        temp.push(results);
      }
    });
    return temp;
  },
  shorten(string) {
    return string.substring(0, 3);
  },
  activeUsers() {
    return Template.instance().activeUsers.get();
  },
});

/* global $ */

Template.Activity_Calendar_Results.events({
  'click .ui.table': function openModal(event, instance) {
    event.preventDefault();
    const day = `#${instance.data.day}`;
    $(day).modal('show');
  },
});

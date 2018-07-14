import { moment } from 'meteor/momentjs:moment';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';

Template.Activity_Calendar_Results.onCreated(function activityCalendarResultsOnCreated() {
  this.activeUsers = new ReactiveVar();
  this.day = new ReactiveVar();
});

Template.Activity_Calendar_Results.helpers({
  dayOfMonth(day) {
    Template.instance().day.set(day);
    return day !== '';
  },
  interactionResults(month, day, userList) {
    const results = [];
    const selectedDay = `${day} ${month}`;
    const startOfDay = new Date(moment(selectedDay, 'DD MMMM YYYY').startOf('day'));
    const endOfDay = new Date(moment(selectedDay, 'DD MMMM YYYY').endOf('day'));
    _.each(userList, function (users, role) {
      const roleResults = {};
      /* const interactions = UserInteractions.find({
        userID: { $in: users },
        timestamp: { $gte: startOfDay, $lte: endOfDay },
      }).fetch(); */
      const selector = {
        username: { $in: users },
        timestamp: { $gte: startOfDay, $lte: endOfDay },
      };
      let interactions;
      userInteractionFindMethod.call({ selector }, (error, result) => {
        if (error) {
          console.log('Error finding user interactions.', error);
        } else {
          interactions = result;
        }
      });
      console.log(interactions);
      roleResults.role = role;
      roleResults.users = _.uniq(_.map(interactions, 'username'));
      roleResults.userCount = roleResults.users.length;
      roleResults.interactionCount = interactions.length;
      results.push(roleResults);
    });
    Template.instance().activeUsers.set(results);
    return results;
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
    const day = `#${instance.day.get()}`;
    $(day).modal('show');
  },
});

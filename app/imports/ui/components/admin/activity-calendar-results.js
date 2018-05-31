import { moment } from 'meteor/momentjs:moment';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { UserInteractions } from '../../../api/analytic/UserInteractionCollection';

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
    const stats = [];
    const selectedDay = `${day} ${month}`;
    const startOfDay = new Date(moment(selectedDay, 'DD MMMM YYYY').startOf('day'));
    const endOfDay = new Date(moment(selectedDay, 'DD MMMM YYYY').endOf('day'));
    _.each(userList, function (users, role) {
      const roleStats = {};
      const interactions = UserInteractions.find({
        userID: { $in: users },
        timestamp: { $gte: startOfDay, $lte: endOfDay },
      }).fetch();
      roleStats.role = role.substring(0, 3);
      roleStats.users = _.uniq(_.pluck(interactions, 'userID'));
      roleStats.userCount = roleStats.users.length;
      roleStats.interactionCount = interactions.length;
      stats.push(roleStats);
    });
    Template.instance().activeUsers.set(stats);
    return stats;
  },
});

/* global $ */

Template.Activity_Calendar_Results.events({
  'click .ui.table': function openModal(event, instance) {
    event.preventDefault();
    const day = `#${instance.day.get()}`
    $(day).modal('show');
  },
});

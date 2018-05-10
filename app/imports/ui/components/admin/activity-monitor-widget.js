import { moment } from 'meteor/momentjs:moment';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ROLE } from '../../../api/role/Role.js';
import { UserInteractions } from '../../../api/analytic/UserInteractionCollection';
import { Users } from '../../../api/user/UserCollection';

function getRangeOfDates(start, end, arr = [start.startOf('day')]) {
  const next = moment(start).add(1, 'day').startOf('day');
  if (next.isAfter(end, 'day')) return arr;
  return getRangeOfDates(next, end, arr.concat(next));
}

const rolesToInclude = [{ role: ROLE.STUDENT, name: 'studentRole' },
  { role: ROLE.FACULTY, name: 'facultyRole' },
  { role: ROLE.MENTOR, name: 'mentorRole' }];

Template.Activity_Monitor_Widget.onCreated(function activityMonitorWidgetOnCreated() {
  this.subscribe(UserInteractions.getPublicationName());
  this.analyze = new ReactiveVar(false);
  this.activityResults = new ReactiveVar();
  this.userCount = new ReactiveVar();
});

Template.Activity_Monitor_Widget.helpers({
  roles() {
    return rolesToInclude;
  },
  analyze() {
    return Template.instance().analyze.get();
  },
  activityResults() {
    return Template.instance().activityResults.get();
  },
  userCount() {
    return Template.instance().userCount.get();
  },
});

Template.Activity_Monitor_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const startDate = new Date(event.target.startDate.value);
    const endDate = new Date(event.target.endDate.value);
    const rangeOfDates = getRangeOfDates(moment(startDate), moment(endDate));
    const checkedRoles = _.pluck(_.filter(rolesToInclude, (role) => {
      return event.target[role.name].checked;
    }), 'role');
    const usersInRoles = _.pluck(Users.findProfiles({
      role: { $in: checkedRoles },
    }), 'userID');
    const interactionsInRange = UserInteractions.find({
      userID: { $in: usersInRoles },
      timestamp: { $gte: startDate, $lte: endDate },
    }).fetch();
    const userCount = _.uniq(_.pluck(interactionsInRange, 'userID')).length;
    instance.userCount.set(userCount);
    const activityResults = [];
    _.each(rangeOfDates, function (date) {
      const activity = {};
      activity.date = date;
      activity.userIDs = [];
      activity.interactionCount = 0;
      _.each(interactionsInRange, function (interaction) {
        if (moment(interaction.timestamp).isSame(date, 'day')) {
          activity.userIDs.push(interaction.userID);
          activity.interactionCount += 1;
        }
      });
      activity.userIDs = _.uniq(activity.userIDs);
      activityResults.push(activity);
    });
    instance.activityResults.set(activityResults);
    console.log(instance.activityResults.get());
    instance.analyze.set(true);
  },
});

Template.Activity_Monitor_Widget.onRendered(function activityMonitorWidgetOnRendered() {
  this.$('#rangeStart').calendar({
    type: 'date',
    endCalendar: this.$('#rangeEnd'),
    formatter: {
      date: function (date) {
        if (!date) return '';
        const day = date.getDate();
        const formatDay = day < 10 ? `0${day}` : day;
        const month = date.getMonth() + 1;
        const formatMonth = month < 10 ? `0${month}` : month;
        const year = date.getFullYear();
        return `${year}-${formatMonth}-${formatDay}T00:00:00`;
      },
    },
  });
  this.$('#rangeEnd').calendar({
    type: 'date',
    startCalendar: this.$('#rangeStart'),
    formatter: {
      date: function (date) {
        if (!date) return '';
        const day = date.getDate();
        const formatDay = day < 10 ? `0${day}` : day;
        const month = date.getMonth() + 1;
        const formatMonth = month < 10 ? `0${month}` : month;
        const year = date.getFullYear();
        return `${year}-${formatMonth}-${formatDay}T23:59:59`;
      },
    },
  });
});

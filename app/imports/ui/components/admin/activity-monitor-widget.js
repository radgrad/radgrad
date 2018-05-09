import { Template } from 'meteor/templating';
import { ROLE } from '../../../api/role/Role.js';
import { UserInteractions } from '../../../api/analytic/UserInteractionCollection';
import { Users } from '../../../api/user/UserCollection';

Template.Activity_Monitor_Widget.onCreated(function activityMonitorWidgetOnCreated() {
  this.subscribe(UserInteractions.getPublicationName());
});

Template.Activity_Monitor_Widget.onRendered(function onRendered() {
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
        return `${year}-${formatMonth}-${formatDay}T00:00:00Z`;
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
        return `${year}-${formatMonth}-${formatDay}T23:59:59Z`;
      },
    },
  });
});

const rolesToInclude = [{ role: ROLE.STUDENT, name: 'studentRole' },
  { role: ROLE.FACULTY, name: 'facultyRole' },
  { role: ROLE.MENTOR, name: 'mentorRole' }];

let interactionsInRange = {};

Template.Activity_Monitor_Widget.helpers({
  roles() {
    return rolesToInclude;
  },
});

Template.Activity_Monitor_Widget.helpers({
  interactions() {
    return interactionsInRange;
  },
});

Template.Activity_Monitor_Widget.events({
  submit(event) {
    event.preventDefault();
    const startDate = new Date(event.target.startDate.value);
    const endDate = new Date(event.target.endDate.value);
    const includedRoles = _.pluck(_.filter(rolesToInclude, (role) => {
      if (event.target[role.name].checked) {
        return true;
      }
      return false;
    }), 'role');
    const usersInRoles = _.pluck(Users.findProfiles({
      role: { $in: includedRoles },
    }), 'userID');
    interactionsInRange = UserInteractions.find({
      userID: { $in: usersInRoles },
      timestamp: { $gte: startDate, $lte: endDate },
    }).fetch();
    console.log(interactionsInRange);
  },
});

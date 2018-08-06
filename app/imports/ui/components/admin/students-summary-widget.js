import { moment } from 'meteor/momentjs:moment';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';

const behaviors = { 'Logged In': 0, 'Change Outlook': 0, Exploration: 0, Planning: 0,
  Verification: 0, Reviewing: 0, Mentorship: 0, 'Level Up': 0, 'Complete Plan Achieved': 0 };

Template.Students_Summary_Widget.onCreated(function studentsSummaryWidgetOnRendered() {
  this.behaviors = new ReactiveVar([]);
  this.startDate = new ReactiveVar('');
  this.endDate = new ReactiveVar('');
});

Template.Students_Summary_Widget.helpers({
  dateRange() {
    const data = Template.instance();
    if (data.startDate.get() === '') {
      return '';
    }
    const startDate = moment(data.startDate.get()).format('MM-DD-YYYY');
    const endDate = moment(data.endDate.get()).format('MM-DD-YYYY');
    return `${startDate} to ${endDate}`;
  },
});

Template.Students_Summary_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const startDate = new Date(event.target.startDate.value);
    const endDate = new Date(event.target.endDate.value);
    instance.startDate.set(startDate);
    instance.endDate.set(endDate);
    const selector = { timestamp: { $gte: startDate, $lte: endDate } };
    const options = { sort: { username: 1, timestamp: 1 } };
    userInteractionFindMethod.call({ selector, options }, (error, result) => {
      if (error) {
        console.log('Error finding user interactions.', error);
      } else {
        const users = _.groupBy(result, 'username');
        console.log(users);
        console.log(Object.keys(users).length);
        _.each(users, function (interactionList, user) {
          if (_.some(interactionList, { type: 'login' })) {
            behaviors['Logged In']++;
          }
          if (_.some(interactionList, (i) => i.type === 'interestIDs' || i.type === 'careerGoalIDs')) {
            behaviors['Change Outlook']++;
          } else {
            console.log('No behavior by user: ', user);
          }
        });
        console.log(behaviors);
      }
    });
  },
});

Template.Students_Summary_Widget.onRendered(function studentsSummaryWidgetOnRendered() {
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

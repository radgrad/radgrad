import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { moment } from 'meteor/momentjs:moment';
import { ReactiveVar } from 'meteor/reactive-var';
import { Users } from '../../../api/user/UserCollection';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';

// This defines the time between sessions
const gap = 10;

Template.Overhead_Analysis_Widget.onCreated(function overheadAnalysisWidgetOnCreated() {
  this.overheadData = new ReactiveVar();
  this.userInteractions = new ReactiveVar();
  this.selectedUser = new ReactiveVar('');
  this.dateRange = new ReactiveVar({});
});

Template.Overhead_Analysis_Widget.helpers({
  overheadData() {
    return Template.instance().overheadData.get();
  },
  selectedUser() {
    return Template.instance().selectedUser.get();
  },
  formatDate(date) {
    return moment(date).format('MM/DD/YY HH:mm');
  },
  dateRange() {
    const dateRange = Template.instance().dateRange.get();
    if ('startDate' in dateRange) {
      const startDate = moment(dateRange.startDate).format('MM-DD-YYYY');
      const endDate = moment(dateRange.endDate).format('MM-DD-YYYY');
      return `${startDate} to ${endDate}`;
    }
    return '';
  },
});

Template.Overhead_Analysis_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const startDate = moment(event.target.startDate.value, 'MMMM D, YYYY').toDate();
    const endDate = moment(event.target.endDate.value, 'MMMM D, YYYY').endOf('day').toDate();
    instance.dateRange.set({ startDate, endDate });
    const selector = { timestamp: { $gte: startDate, $lte: endDate } };
    const options = { sort: { username: 1, timestamp: 1 } };
    userInteractionFindMethod.call({ selector, options }, (error, result) => {
      if (error) {
        console.log('Error finding user interactions.', error);
      } else {
        const overheadData = [];
        const userInteractions = _.groupBy(result, 'username');
        instance.userInteractions.set(userInteractions);
        _.each(userInteractions, function (interactions, username) {
          const sessions = [];
          let totalTime = 0;
          let slicedIndex = 0;
          const userData = { username, numSessions: 1, numDocs: interactions.length, docsPerMin: 0, totalTime: 0 };
          _.each(interactions, function (interaction, index) {
            if (index !== 0) {
              const prevTimestamp = moment(new Date(interactions[index - 1].timestamp));
              const timestamp = moment(new Date(interaction.timestamp));
              const difference = moment.duration(timestamp.diff(prevTimestamp)).asMinutes();
              if (difference >= gap) {
                sessions.push(_.slice(interactions, slicedIndex, index));
                slicedIndex = index;
                userData.numSessions++;
              }
              if (index === interactions.length - 1) {
                sessions.push(_.slice(interactions, slicedIndex));
              }
            }
          });
          _.each(sessions, function (session) {
            const firstTimestamp = moment(new Date(session[0].timestamp));
            const lastTimestamp = moment(new Date(session[session.length - 1].timestamp));
            let difference = Math.ceil(moment.duration(lastTimestamp.diff(firstTimestamp)).asMinutes());
            if (difference === 0) {
              difference = 1;
            }
            totalTime += difference;
          });
          userData.docsPerMin = (userData.numDocs / totalTime).toFixed(2);
          userData.totalTime = totalTime;
          overheadData.push(userData);
        });
        instance.overheadData.set(overheadData);
      }
    });
  },
  'click .ui.tiny.button': function openModal(event, instance) {
    event.preventDefault();
    const user = Users.getFullName(event.target.value);
    const interactions = instance.userInteractions.get()[event.target.value];
    const data = { user, interactions };
    instance.selectedUser.set(data);
    $('#user-overhead').modal('show');
  },
});

Template.Overhead_Analysis_Widget.onRendered(function overheadAnalysisWidgetOnRendered() {
  this.$('#rangeStart').calendar({
    type: 'date',
    endCalendar: this.$('#rangeEnd'),
  });
  this.$('#rangeEnd').calendar({
    type: 'date',
    startCalendar: this.$('#rangeStart'),
  });
});

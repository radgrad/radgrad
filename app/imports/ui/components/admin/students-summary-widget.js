import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';

Template.Students_Summary_Widget.onCreated(function studentsSummaryWidgetOnRendered() {
  this.interactions = new ReactiveVar();
});

Template.Students_Summary_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const startDate = new Date(event.target.startDate.value);
    const endDate = new Date(event.target.endDate.value);
    const selector = {
      timestamp: { $gte: startDate, $lte: endDate },
    };
    userInteractionFindMethod.call({ selector }, (error, result) => {
      if (error) {
        console.log('Error finding user interactions.', error);
      } else {
        const interactions = result;
        instance.interactions.set(interactions);
        console.log(instance.interactions.get());
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

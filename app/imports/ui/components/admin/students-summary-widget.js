import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Students_Summary_Widget.onCreated(function studentsSummaryWidgetOnRendered() {
  this.userList = new ReactiveVar();
});

Template.Students_Summary_Widget.onRendered(function studentsSummaryWidgetOnRendered() {
  this.$('#rangeStart').calendar({
    type: 'date',
    endCalendar: this.$('#rangeEnd'),
  });
  this.$('#rangeEnd').calendar({
    type: 'date',
    startCalendar: this.$('#rangeStart'),
  });
});

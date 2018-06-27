import { moment } from 'meteor/momentjs:moment';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';

const dateFormat = 'MMMM YYYY';

Template.Activity_Calendar_Widget.onCreated(function activityCalendarWidgetOnCreated() {
  this.currentDate = new ReactiveVar(moment().format(dateFormat));
});

Template.Activity_Calendar_Widget.helpers({
  month() {
    const month = moment(Template.instance().currentDate.get(), dateFormat).format(dateFormat);
    return month;
  },
  daysOfWeek() {
    return moment.weekdaysShort();
  },
  // Return an array that represents the current month
  monthArray() {
    const currentDate = Template.instance().currentDate.get();
    // moment().day() returns the day number (0-6)
    const firstDayOffset = moment(currentDate, dateFormat).startOf('month').day();
    const lastDayOffset = 6 - moment(currentDate, dateFormat).endOf('month').day();
    const daysInMonth = moment(currentDate, dateFormat).daysInMonth();
    // Create month array with nested weeks.  Utilizes the offsets to create evenly padded weeks.
    let monthArray = _.range(1, daysInMonth + 1);
    _.times(firstDayOffset, function () {
      monthArray.unshift('');
    });
    _.times(lastDayOffset, function () {
      monthArray.push('');
    });
    monthArray = _.chunk(monthArray, 7);
    return monthArray;
  },
});

Template.Activity_Calendar_Widget.events({
  'click .prev': function setPrevMonth(event, instance) {
    event.preventDefault();
    const prevMonth = moment(instance.currentDate.get(), dateFormat).subtract(1, 'months');
    instance.currentDate.set(prevMonth);
  },
  'click .next': function setNextMonth(event, instance) {
    event.preventDefault();
    const nextMonth = moment(instance.currentDate.get(), dateFormat).add(1, 'months');
    instance.currentDate.set(nextMonth);
  },
});

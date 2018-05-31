import { moment } from 'meteor/momentjs:moment';
import { Template } from 'meteor/templating';

Template.Activity_Calendar_Modal.helpers({
  date(month, day) {
    const selectedDay = `${day} ${month}`;
    const formattedDate = moment(selectedDay, 'DD MMMM YYYY').format('MM-DD-YYYY');
    return formattedDate;
  },
});
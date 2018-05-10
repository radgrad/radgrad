import { moment } from 'meteor/momentjs:moment';
import { Template } from 'meteor/templating';

Template.Activity_Monitor_Results.helpers({
  noUsers(userCount) {
    return userCount === 0;
  },
  formatDate(date) {
    return moment(date).format('MM-DD');
  },
  buttonHeight(day, userCount) {
    const userCountForDay = day.userIDs.length;
    const percentOfTotalUsers = (userCountForDay / userCount) * 100;
    console.log(userCount, userCountForDay, percentOfTotalUsers);
    if (percentOfTotalUsers === 0) {
      return 5;
    } else if (percentOfTotalUsers <= 20) {
      return 10;
    } else if (percentOfTotalUsers <= 40) {
      return 20;
    } else if (percentOfTotalUsers <= 60) {
      return 30;
    } else if (percentOfTotalUsers <= 80) {
      return 40;
    }
    return 50;
  },
});

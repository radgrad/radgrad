import { moment } from 'meteor/momentjs:moment';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Users } from '../../../api/user/UserCollection';
import { UserInteractions } from '../../../api/analytic/UserInteractionCollection';

Template.Activity_Calendar_Modal.onCreated(function activityCalendarModalOnCreated() {
  this.userInteractions = new ReactiveVar({});
  this.date = new ReactiveVar();
});

Template.Activity_Calendar_Modal.helpers({
  date(month, day) {
    const selectedDay = `${day} ${month}`;
    const formattedDate = moment(selectedDay, 'DD MMMM YYYY').format('MM-DD-YYYY');
    Template.instance().date.set(formattedDate);
    return formattedDate;
  },
  activeTab(role) {
    return role === 'STUDENT' ? 'active' : '';
  },
  interactionResults(users) {
    const results = [];
    const date = Template.instance().date.get();
    const startOfDay = new Date(moment(date, 'MM-DD-YYYY').startOf('day'));
    const endOfDay = new Date(moment(date, 'MM-DD-YYYY').endOf('day'));
    _.each(users, (userID) => {
      const user = {};
      const interactions = UserInteractions.find({
        userID: userID,
        timestamp: { $gte: startOfDay, $lte: endOfDay },
      }).fetch();
      user.name = Users.getFullName(userID).toUpperCase();
      user.interactionCount = interactions.length;
      user.interactions = interactions;
      results.push(user);
    });
    console.log(results);
    return results;
  },
});

Template.Activity_Calendar_Modal.onRendered(function activityCalendarModalOnRendered() {
  this.$('.menu .item').tab();
  this.$('.ui.accordion').accordion();
});

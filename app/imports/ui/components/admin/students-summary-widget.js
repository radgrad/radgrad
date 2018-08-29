import { moment } from 'meteor/momentjs:moment';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { Users } from '../../../api/user/UserCollection';

let studentPopulation;

Template.Students_Summary_Widget.onCreated(function studentsSummaryWidgetOnRendered() {
  this.interactions = new ReactiveVar({});
  this.selectedUser = new ReactiveVar({});
  this.behaviors = new ReactiveVar([]);
  this.startDate = new ReactiveVar('');
  this.endDate = new ReactiveVar('');
  studentPopulation = StudentProfiles.find().count();
  /* There is a possible bug with Semantic where the timeline modal is duplicated in the DOM
    upon navigating back to the student summary page from any other page. A suggested fix (temporary)
    is to simply remove the timeline modal every time the template is created again. */
  $('#timeline').remove();
});

Template.Students_Summary_Widget.helpers({
  behaviors() {
    return Template.instance().behaviors.get();
  },
  dateRange() {
    const data = Template.instance();
    if (data.startDate.get() === '') {
      return '';
    }
    const startDate = moment(data.startDate.get()).format('MM-DD-YYYY');
    const endDate = moment(data.endDate.get()).format('MM-DD-YYYY');
    return `${startDate} to ${endDate}`;
  },
  firstIndex(index) {
    return index === 0;
  },
  percent(count) {
    return ((count / studentPopulation) * 100).toFixed(0);
  },
  selectedUser() {
    return !_.isEmpty(Template.instance().selectedUser.get());
  },
  user() {
    return Template.instance().selectedUser.get();
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
        const users = _.groupBy(_.filter(result, (u) => Users.getProfile(u.username).role === 'STUDENT'), 'username');
        const behaviors = [{ type: 'Log In', count: 0, users: [], description: 'Logged into application' },
          { type: 'Change Outlook', count: 0, users: [], description: 'Updated interests, career goals, or degree' },
          { type: 'Exploration', count: 0, users: [], description: 'Viewed entries in Explorer' },
          { type: 'Planning', count: 0, users: [], description: 'Added or removed course/opportunity' },
          { type: 'Verification', count: 0, users: [], description: 'Requested verification' },
          { type: 'Reviewing', count: 0, users: [], description: 'Reviewed a course' },
          { type: 'Mentorship', count: 0, users: [], description: 'Visited the MentorSpace page or asked a question' },
          { type: 'Level Up', count: 0, users: [], description: 'Leveled up' },
          { type: 'Complete Plan', count: 0, users: [], description: 'Created a plan with 100 ICE' },
          { type: 'Profile', count: 0, users: [], description: 'Updated personal image or website url' }];
        _.each(users, function (interactions, user) {
          if (_.some(interactions, { type: 'login' })) {
            behaviors[0].count++;
            behaviors[0].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'careerGoalIDs' || i.type === 'interestIDs' ||
              i.type === 'academicPlanID')) {
            behaviors[1].count++;
            behaviors[1].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'pageView' && i.typeData[0].includes('explorer/'))) {
            behaviors[2].count++;
            behaviors[2].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'addCourse' || i.type === 'removeCourse' ||
              i.type === 'addOpportunity' || i.type === 'removeOpportunity')) {
            behaviors[3].count++;
            behaviors[3].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'verifyRequest')) {
            behaviors[4].count++;
            behaviors[4].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'addReview')) {
            behaviors[5].count++;
            behaviors[5].users.push(user);
          }
          if (_.some(interactions, (i) => (i.type === 'pageView' && i.typeData[0].includes('mentor-space')) ||
              i.type === 'askQuestion')) {
            behaviors[6].count++;
            behaviors[6].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'level')) {
            behaviors[7].count++;
            behaviors[7].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'picture' || i.type === 'website')) {
            behaviors[9].count++;
            behaviors[9].users.push(user);
          }
        });
        instance.interactions.set(users);
        instance.behaviors.set(behaviors);
      }
    });
  },
  'click .ui.tiny.button': function openModal(event, instance) {
    event.preventDefault();
    const username = event.target.value;
    const selectedUser = { username, interactions: instance.interactions.get()[username] };
    instance.selectedUser.set(selectedUser);
    $('#timeline').modal('show');
  },
});

Template.Students_Summary_Widget.onRendered(function studentsSummaryWidgetOnRendered() {
  this.$('#range-start').calendar({
    type: 'date',
    endCalendar: this.$('#range-end'),
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
  this.$('#range-end').calendar({
    type: 'date',
    startCalendar: this.$('#range-start'),
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
  this.$('.ui.form').form({
    fields: {
      startDate: 'empty',
      endDate: 'empty',
    },
  });
  this.$('.ui.accordion').accordion();
});

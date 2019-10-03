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
  this.interactionsByUser = new ReactiveVar();
  this.selectedUser = new ReactiveVar();
  this.behaviors = new ReactiveVar();
  this.dateRange = new ReactiveVar();
  this.working = new ReactiveVar(false);
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
    const dateRange = Template.instance().dateRange.get();
    if (_.isEmpty(dateRange)) {
      return '';
    }
    const startDate = moment(dateRange.startDate).format('MM-DD-YYYY');
    const endDate = moment(dateRange.endDate).format('MM-DD-YYYY');
    return `${startDate} to ${endDate}`;
  },
  percent(count) {
    return ((count / studentPopulation) * 100).toFixed(0);
  },
  selectedUser() {
    return !_.isEmpty(Template.instance().selectedUser.get());
  },
  renderedSummary() {
    return !_.isEmpty(Template.instance().dateRange.get());
  },
  timelineChart() {
    const interactionsByUser = Template.instance().interactionsByUser.get();
    if (interactionsByUser) {
      const dateRange = Template.instance().dateRange.get();
      const startDate = moment(dateRange.startDate, 'MMMM D, YYYY');
      const endDate = moment(dateRange.endDate, 'MMMM D, YYYY');
      const numDays = endDate.diff(startDate, 'days') + 1;
      const behaviorsByDate = {};
      _.times(numDays, function (index) {
        const date = moment(startDate).add(index, 'days');
        behaviorsByDate[moment(date).format('MMM D, YYYY')] = [];
      });
      const behaviorList = ['Log In', 'Change Outlook', 'Exploration', 'Planning', 'Verification',
        'Reviewing', 'Mentorship', 'Level Up', 'Complete Plan', 'Profile', 'Log Out'];
      _.each(behaviorsByDate, function (array, date, obj) {
        _.each(interactionsByUser, function (interactions) {
          const interactionsWithinDate = _.filter(interactions, function (interaction) {
            const interactionDate = moment(interaction.timestamp).format('MMM D, YYYY');
            return interactionDate === date;
          });
          if (_.some(interactionsWithinDate, { type: 'login' })) {
            obj[date].push(behaviorList[0]);
          }
          if (_.some(interactionsWithinDate, (i) => i.type === 'careerGoalIDs' || i.type === 'interestIDs' ||
              i.type === 'academicPlanID')) {
            obj[date].push(behaviorList[1]);
          }
          if (_.some(interactionsWithinDate, (i) => i.type === 'pageView' && i.typeData[0].includes('explorer/'))) {
            obj[date].push(behaviorList[2]);
          }
          if (_.some(interactionsWithinDate, (i) => i.type === 'addCourse' || i.type === 'removeCourse' ||
              i.type === 'addOpportunity' || i.type === 'removeOpportunity')) {
            obj[date].push(behaviorList[3]);
          }
          if (_.some(interactionsWithinDate, (i) => i.type === 'verifyRequest')) {
            obj[date].push(behaviorList[4]);
          }
          if (_.some(interactionsWithinDate, (i) => i.type === 'addReview')) {
            obj[date].push(behaviorList[5]);
          }
          if (_.some(interactionsWithinDate, (i) => (i.type === 'pageView' &&
              i.typeData[0].includes('mentor-space')) || i.type === 'askQuestion')) {
            obj[date].push(behaviorList[6]);
          }
          if (_.some(interactionsWithinDate, (i) => i.type === 'level')) {
            obj[date].push(behaviorList[7]);
          }
          if (_.some(interactionsWithinDate, (i) => i.type === 'completePlan')) {
            obj[date].push(behaviorList[8]);
          }
          if (_.some(interactionsWithinDate, (i) => i.type === 'picture' || i.type === 'website')) {
            obj[date].push(behaviorList[9]);
          }
          if (_.some(interactionsWithinDate, (i) => i.type === 'logout')) {
            obj[date].push(behaviorList[10]);
          }
        });
      });
      const categories = _.map(behaviorsByDate, function (behaviors, date) {
        const shortDate = date.substring(0, date.length - 6);
        return shortDate;
      });
      const series = _.map(behaviorList, function (behavior) {
        return { name: behavior, data: [] };
      });
      _.each(behaviorsByDate, function (behaviors) {
        const groupedBehaviors = _.groupBy(behaviors);
        _.each(behaviorList, function (behavior) {
          const behaviorCount = groupedBehaviors[behavior];
          const behaviorSeries = _.find(series, { name: behavior });
          if (behaviorCount) {
            behaviorSeries.data.push((behaviorCount.length / studentPopulation) * 100);
          } else {
            behaviorSeries.data.push(0);
          }
        });
      });
      return {
        title: { text: null },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
        },
        xAxis: {
          categories,
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Percent Number Of Students',
          },
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false,
            },
          },
        },
        series,
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
            },
          }],
        },
        credits: {
          enabled: false,
        },
      };
    }
    return { title: { text: null } };
  },
  user() {
    return Template.instance().selectedUser.get();
  },
  working() {
    return Template.instance().working.get();
  },
});

Template.Students_Summary_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    instance.working.set(true);
    const startDate = moment(event.target.startDate.value, 'MMMM D, YYYY').toDate();
    const endDate = moment(event.target.endDate.value, 'MMMM D, YYYY').endOf('day').toDate();
    const dateRange = { startDate, endDate };
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
          { type: 'Profile', count: 0, users: [], description: 'Updated personal image or website url' },
          { type: 'Log Out', count: 0, users: [], description: 'Logged out' }];
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
          if (_.some(interactions, (i) => i.type === 'completePlan')) {
            behaviors[8].count++;
            behaviors[8].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'picture' || i.type === 'website')) {
            behaviors[9].count++;
            behaviors[9].users.push(user);
          }
          if (_.some(interactions, { type: 'logout' })) {
            behaviors[10].count++;
            behaviors[10].users.push(user);
          }
        });
        instance.interactionsByUser.set(users);
        instance.behaviors.set(behaviors);
        instance.dateRange.set(dateRange);
        instance.working.set(false);
      }
    });
  },
  'click .ui.tiny.button': function openModal(event, instance) {
    event.preventDefault();
    const username = event.target.value;
    const selectedUser = { username, interactions: instance.interactionsByUser.get()[username] };
    instance.selectedUser.set(selectedUser);
    $('#timeline').modal('show');
  },
  'click .chart.item': function reflow(event) {
    event.preventDefault();
    $('#timeline-chart').highcharts().reflow();
  },
});

Template.Students_Summary_Widget.onRendered(function studentsSummaryWidgetOnRendered() {
  this.$('#range-start').calendar({
    type: 'date',
    endCalendar: this.$('#range-end'),
  });
  this.$('#range-end').calendar({
    type: 'date',
    startCalendar: this.$('#range-start'),
  });
  this.$('.ui.form').form({
    fields: {
      startDate: 'empty',
      endDate: 'empty',
    },
  });
  this.$('.ui.accordion').accordion();
  this.$('.pointing.menu .item').tab();
});

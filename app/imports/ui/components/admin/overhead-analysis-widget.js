import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import { moment } from 'meteor/momentjs:moment';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Users } from '../../../api/user/UserCollection';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';

// This defines the time between sessions
const gap = 10;

function createBucket(groups) {
  let buckets = [];
  _.each(groups, function (group, docsPerMin) {
    const bucket = (docsPerMin - (docsPerMin % 10)) / 10;
    if (!buckets[bucket]) {
      buckets[bucket] = 0;
    }
    buckets[bucket] += group.length;
  });
  buckets = _.map(buckets, function (value) {
    if (value) {
      return value;
    }
    return 0;
  });
  return buckets;
}

Template.Overhead_Analysis_Widget.onCreated(function overheadAnalysisWidgetOnCreated() {
  this.overheadData = new ReactiveVar();
  this.userInteractions = new ReactiveVar();
  this.overheadBuckets = new ReactiveVar();
  this.selectedUser = new ReactiveVar('');
  this.dateRange = new ReactiveVar({});
  this.sortOrder = new ReactiveDict();
  this.working = new ReactiveVar(false);
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
  overheadChart() {
    const overheadBuckets = Template.instance().overheadBuckets.get();
    const buckets = _.map(overheadBuckets, function (value, index) {
      const minRange = index * 10;
      const maxRange = minRange + 9;
      return `${minRange}-${maxRange}`;
    });
    const data = _.map(overheadBuckets, (value) => value);
    return {
      chart: { type: 'column' },
      title: { text: null },
      colors: ['rgb(79, 168, 143, 0.80)'],
      legend: { enabled: false },
      xAxis: {
        title: {
          text: 'Number of Documents Per Minute',
          style: {
            color: '#000',
          },
        },
        categories: buckets,
      },
      yAxis: {
        title: {
          text: 'Occurrence',
          style: {
            color: '#000',
          },
        },
        min: 0,
      },
      tooltip: {
        headerFormat: '<span style="font-size: 12px">Docs/Min: <b>{point.key}</b></span><br/>',
        pointFormat: '<span style="font-size: 12px">Occurrence: <b>{point.y}</b></span><br/>',
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
        },
      },
      series: [{ data: data }],
      credits: {
        enabled: false,
      },
    };
  },
  working() {
    return Template.instance().working.get();
  },
});

Template.Overhead_Analysis_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    instance.working.set(true);
    const startDate = moment(event.target.startDate.value, 'MMMM D, YYYY').toDate();
    const endDate = moment(event.target.endDate.value, 'MMMM D, YYYY').endOf('day').toDate();
    instance.dateRange.set({ startDate, endDate });
    const selector = { timestamp: { $gte: startDate, $lte: endDate } };
    const options = { sort: { username: 1, timestamp: 1 } };
    userInteractionFindMethod.call({ selector, options }, (error, result) => {
      if (error) {
        console.log('Error finding user interactions.', error);
      } else {
        const timeGroups = _.groupBy(result, function (interaction) {
          return moment(interaction.timestamp).utc(-10).format('MMDDYYYYHHmm');
        });
        const docsPerMinGroups = _.groupBy(timeGroups, function (time) {
          return time.length;
        });
        const overheadBuckets = createBucket(docsPerMinGroups);
        instance.overheadBuckets.set(overheadBuckets);
        const userInteractions = _.groupBy(result, 'username');
        instance.userInteractions.set(userInteractions);
        const overheadData = [];
        _.each(userInteractions, function (interactions, username) {
          const sessions = [];
          let totalTime = 0;
          let slicedIndex = 0;
          const userData = { username, 'num-sessions': 1, 'num-docs': interactions.length,
            'docs-per-min': 0, 'total-time': 0 };
          _.each(interactions, function (interaction, index) {
            if (index !== 0) {
              const prevTimestamp = moment(new Date(interactions[index - 1].timestamp));
              const timestamp = moment(new Date(interaction.timestamp));
              const difference = moment.duration(timestamp.diff(prevTimestamp)).asMinutes();
              if (difference >= gap) {
                sessions.push(_.slice(interactions, slicedIndex, index));
                slicedIndex = index;
                userData['num-sessions']++;
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
          userData['docs-per-min'] = parseFloat((userData['num-docs'] / totalTime).toFixed(2));
          userData['total-time'] = totalTime;
          overheadData.push(userData);
        });
        instance.overheadData.set(overheadData);
        instance.sortOrder.clear();
        instance.working.set(false);
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
  'click .sorting-header': function sortColumn(event, instance) {
    event.preventDefault();
    const headerID = event.currentTarget.id;
    let sortBy = instance.sortOrder.get(headerID);
    if (!sortBy) sortBy = 'desc';
    const overheadData = _.orderBy(instance.overheadData.get(), [headerID], [sortBy]);
    if (sortBy === 'asc') {
      instance.sortOrder.set(headerID, 'desc');
    } else {
      instance.sortOrder.set(headerID, 'asc');
    }
    instance.overheadData.set(overheadData);
  },
  'click .chart.item': function reflow(event) {
    event.preventDefault();
    $('#overhead-chart').highcharts().reflow();
  },
});

Template.Overhead_Analysis_Widget.onRendered(function overheadAnalysisWidgetOnRendered() {
  this.$('#range-start').calendar({
    type: 'date',
    endCalendar: this.$('#range-end'),
  });
  this.$('#range-end').calendar({
    type: 'date',
    startCalendar: this.$('#range-start'),
  });
  this.$('.pointing.menu .item').tab();
});


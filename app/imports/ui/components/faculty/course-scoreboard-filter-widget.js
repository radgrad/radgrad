import { Template } from 'meteor/templating';

Template.Course_Scoreboard_Filter_Widget.onCreated(function courseScoreboardFilterWidgetOnCreated() {
  this.state = this.data.dictionary;
});

Template.Course_Scoreboard_Filter_Widget.helpers({
  isEE() {
    return Template.instance().state.get('byEE');
  },
  isICS() {
    return Template.instance().state.get('byICS');
  },
  is1xx() {
    return Template.instance().state.get('by1xx');
  },
  is2xx() {
    return Template.instance().state.get('by2xx');
  },
  is3xx() {
    return Template.instance().state.get('by3xx');
  },
  is4xx() {
    return Template.instance().state.get('by4xx');
  },
});

Template.Course_Scoreboard_Filter_Widget.events({
  'click .jsByICS': function clickedInterests(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by ICS');
    instance.state.set('byICS', !instance.state.get('byICS'));
  },
  'click .jsByEE': function clickedHighI(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by EE', instance);
    instance.state.set('byEE', !instance.state.get('byEE'));
  },
  'click .jsBy1xx': function clickedHighE(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by 1xx');
    instance.state.set('by1xx', !instance.state.get('by1xx'));
  },
  'click .jsBy2xx': function clickedHighE(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by 2xx');
    instance.state.set('by2xx', !instance.state.get('by2xx'));
  },
  'click .jsBy3xx': function clickedHighI(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by 3xx');
    instance.state.set('by3xx', !instance.state.get('by3xx'));
  },
  'click .jsBy4xx': function clickedHighI(event, instance) {
    event.preventDefault();
    // console.log(event.target, 'filter by 4xx');
    instance.state.set('by4xx', !instance.state.get('by4xx'));
  },
});

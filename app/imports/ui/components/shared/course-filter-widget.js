import { Template } from 'meteor/templating';
import { courseFilterKeys } from './card-explorer-courses-widget';

Template.Course_Filter_Widget.onCreated(function coursefilterwidgetOnCreated() {
  this.filter = this.data.filter;
});

Template.Course_Filter_Widget.helpers({
  isAll() {
    return Template.instance().filter.get() === courseFilterKeys.none;
  },
  all() {
    return courseFilterKeys.none;
  },
  is300() {
    return Template.instance().filter.get() === courseFilterKeys.threeHundredPLus;
  },
  threeHundredPlus() {
    return courseFilterKeys.threeHundredPLus;
  },
  is400() {
    return Template.instance().filter.get() === courseFilterKeys.fourHundredPlus;
  },
  fourHundredPlus() {
    return courseFilterKeys.fourHundredPlus;
  },
  is600() {
    return Template.instance().filter.get() === courseFilterKeys.sixHundredPlus;
  },
  sixHundredPlus() {
    return courseFilterKeys.sixHundredPlus;
  },
});

Template.Course_Filter_Widget.events({
  change: function change(event) {
    Template.instance().filter.set(event.target.value);
  },
});

Template.Course_Filter_Widget.onRendered(function coursefilterwidgetOnRendered() {
  this.$('.ui.radio.checkbox').checkbox();
});

Template.Course_Filter_Widget.onDestroyed(function coursefilterwidgetOnDestroyed() {
  // add your statement here
});


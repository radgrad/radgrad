import { Template } from 'meteor/templating';
import { sortOrderKeys } from './card-explorer-opportunities-widget';

Template.Opportunity_Sort_Order_Widget.onCreated(function opportunitysortorderwidgetOnCreated() {
  this.sortOrder = this.data.sortOrder;
});

Template.Opportunity_Sort_Order_Widget.helpers({
  isMatch() {
    return Template.instance().sortOrder.get() === sortOrderKeys.match;
  },
  isInnovation() {
    return Template.instance().sortOrder.get() === sortOrderKeys.i;
  },
  isExperience() {
    return Template.instance().sortOrder.get() === sortOrderKeys.e;
  },
  isAlpha() {
    return Template.instance().sortOrder.get() === sortOrderKeys.alpha;
  },
  match() {
    return sortOrderKeys.match;
  },
  i() {
    return sortOrderKeys.i;
  },
  e() {
    return sortOrderKeys.e;
  },
  alpha() {
    return sortOrderKeys.alpha;
  },
});

Template.Opportunity_Sort_Order_Widget.events({
  change: function change(event) {
    Template.instance().sortOrder.set(event.target.value);
  },
});

Template.Opportunity_Sort_Order_Widget.onRendered(function opportunitysortorderwidgetOnRendered() {
  this.$('.ui.radio.checkbox').checkbox();
});

Template.Opportunity_Sort_Order_Widget.onDestroyed(function opportunitysortorderwidgetOnDestroyed() {
  // add your statement here
});


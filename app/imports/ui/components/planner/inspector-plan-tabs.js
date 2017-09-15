import { Template } from 'meteor/templating';

Template.Inspector_Plan_Tabs.onCreated(function inspectorPlanTabsOnCreated() {
  this.state = this.data.dictionary;
});

Template.Inspector_Plan_Tabs.helpers({
  getDictionary() {
    return Template.instance().state;
  },
});

Template.Inspector_Plan_Tabs.events({
  // add your events here
});

Template.Inspector_Plan_Tabs.onRendered(function inspectorPlanTabsOnRendered() {
  this.$('.menu .item').tab();
});

Template.Inspector_Plan_Tabs.onDestroyed(function inspectorPlanTabsOnDestroyed() {
  // add your statement here
});


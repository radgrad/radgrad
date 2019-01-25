import { Template } from 'meteor/templating';
import { plannerKeys } from './academic-plan';

Template.Inspector_Plan_Tabs.onCreated(function inspectorPlanTabsOnCreated() {
  this.state = this.data.dictionary;
});

Template.Inspector_Plan_Tabs.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  showInspector() {
    const selectedInstance = Template.instance()
      .state
      .get(plannerKeys.detailCourseInstance) || Template.instance()
      .state
      .get(plannerKeys.detailOpportunityInstance);
    console.log(`showInspector(${!!selectedInstance})`);
    return !!selectedInstance;
  },
  showPlan() {
    const selectedInstance = Template.instance()
      .state
      .get(plannerKeys.detailCourseInstance) || Template.instance()
      .state
      .get(plannerKeys.detailOpportunityInstance);
    console.log(`showPlan(${!selectedInstance})`);
    return !selectedInstance;
  },
});

Template.Inspector_Plan_Tabs.events({
  // add your events here
});

Template.Inspector_Plan_Tabs.onRendered(function inspectorPlanTabsOnRendered() {
  this.$('.menu .item')
    .tab();
});

Template.Inspector_Plan_Tabs.onDestroyed(function inspectorPlanTabsOnDestroyed() {
  // add your statement here
});


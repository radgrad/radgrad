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
  'click .jsInspectorTab': function clickInspectorTab(event) {
    const tabName = event.target.dataset.tab;
    const template = Template.instance();
    template.state.set(plannerKeys.selectedPlanTab, tabName === plannerKeys.selectedPlanTab);
    template.state.set(plannerKeys.selectedInspectorTab, tabName === plannerKeys.selectedInspectorTab);
    console.log(tabName, template.state.get(plannerKeys.selectedPlanTab),
      template.state.get(plannerKeys.selectedInspectorTab));
  },
});

Template.Inspector_Plan_Tabs.onRendered(function inspectorPlanTabsOnRendered() {
  this.$('.menu .item')
    .tab();
});

Template.Inspector_Plan_Tabs.onDestroyed(function inspectorPlanTabsOnDestroyed() {
  // add your statement here
});


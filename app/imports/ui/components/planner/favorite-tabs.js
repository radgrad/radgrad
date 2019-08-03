import { Template } from 'meteor/templating';

export const favoriteKeys = {
  academicPlans: 'academicPlans',
  courses: 'courses',
  opportunities: 'opportunities',
};

Template.Favorite_Tabs.onCreated(function favoriteTabsOnCreated() {
  this.state = this.data.dictionary;
});

Template.Favorite_Tabs.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  academicPlanName() {
    return favoriteKeys.academicPlans;
  },
  coursesName() {
    return favoriteKeys.courses;
  },
  opportunityName() {
    return favoriteKeys.opportunities;
  },
  showCourse() {
    return Template.instance().state.get(favoriteKeys.courses);
  },
  showOpportunity() {
    return Template.instance().state.get(favoriteKeys.opportunities);
  },
  showPlan() {
    return Template.instance().state.get(favoriteKeys.academicPlans);
  },
});

Template.Favorite_Tabs.events({
  'click .jsInspectorTab': function clickInspectorTab(event) {
    const tabName = event.target.dataset.tab;
    const template = Template.instance();
    template.state.set(favoriteKeys.academicPlans, tabName === favoriteKeys.academicPlans);
    template.state.set(favoriteKeys.courses, tabName === favoriteKeys.courses);
    template.state.set(favoriteKeys.opportunities, tabName === favoriteKeys.opportunities);
  },
});

Template.Favorite_Tabs.onRendered(function favoriteTabsOnRendered() {
  this.$('.menu .item')
    .tab();
});

Template.Favorite_Tabs.onDestroyed(function favoriteTabsOnDestroyed() {
  // add your statement here
});


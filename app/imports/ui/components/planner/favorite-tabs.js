import { Template } from 'meteor/templating';
import {
  plannerKeys,
  selectDetailsTab, selectFavoriteAcademicPlansTab,
  selectFavoriteCoursesTab,
  selectFavoriteOpportunitiesTab,
} from './academic-plan';


Template.Favorite_Tabs.onCreated(function favoriteTabsOnCreated() {
  this.state = this.data.dictionary;
});

Template.Favorite_Tabs.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  academicPlanName() {
    return plannerKeys.selectedPlans;
  },
  coursesName() {
    return plannerKeys.selectedCourses;
  },
  detailsName() {
    return plannerKeys.selectedDetails;
  },
  opportunityName() {
    return plannerKeys.selectedOpportunities;
  },
  showCourse() {
    return Template.instance().state.get(plannerKeys.selectedCourses);
  },
  showDetails() {
    return Template.instance().state.get(plannerKeys.selectedDetails);
  },
  showOpportunity() {
    return Template.instance().state.get(plannerKeys.selectedOpportunities);
  },
  showPlan() {
    return Template.instance().state.get(plannerKeys.selectedPlans);
  },
});

Template.Favorite_Tabs.events({
  'click .jsInspectorTab': function clickInspectorTab(event) {
    const tabName = event.target.dataset.tab;
    const state = Template.instance().state;
    switch (tabName) {
      case plannerKeys.selectedCourses:
        selectFavoriteCoursesTab(state);
        break;
      case plannerKeys.selectedDetails:
        selectDetailsTab(state);
        break;
      case plannerKeys.selectedOpportunities:
        selectFavoriteOpportunitiesTab(state);
        break;
      case plannerKeys.selectedPlans:
        selectFavoriteAcademicPlansTab(state);
        break;
      default:
        selectFavoriteOpportunitiesTab(state);
    }
  },
});

Template.Favorite_Tabs.onRendered(function favoriteTabsOnRendered() {
  this.$('.menu .item')
    .tab();
});

Template.Favorite_Tabs.onDestroyed(function favoriteTabsOnDestroyed() {
  // add your statement here
});


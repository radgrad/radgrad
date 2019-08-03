import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { $ } from 'meteor/jquery';
import * as RouteNames from '../../../startup/client/router.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';

Template.Favorite_Academic_Plan_Viewer_Widget.onCreated(function favoriteAcademicPlanViewerWidgetOnCreated() {
  this.plan = new ReactiveVar('');
});

Template.Favorite_Academic_Plan_Viewer_Widget.helpers({
  getPlans() {
    const studentID = getUserIdFromRoute();
    const favorites = FavoriteAcademicPlans.findNonRetired({ studentID });
    return _.map(favorites, (f) => AcademicPlans.findDoc(f.academicPlanID));
  },
  getPlan() {
    return Template.instance().plan;
  },
  planExplorerRouteName() {
    return RouteNames.studentExplorerPlansPageRouteName;
  },
});

Template.Favorite_Academic_Plan_Viewer_Widget.events({
  'change [name=academicPlan]': function changePlan(event) {
    event.preventDefault();
    const plan = AcademicPlans.findDoc($(event.target).val());
    console.log(plan);
    Template.instance().plan.set(plan);
  },
});

Template.Favorite_Academic_Plan_Viewer_Widget.onRendered(function favoriteAcademicPlanViewerWidgetOnRendered() {
  this.$('.dropdown').dropdown({
  });
});

Template.Favorite_Academic_Plan_Viewer_Widget.onDestroyed(function favoriteAcademicPlanViewerWidgetOnDestroyed() {
  // add your statement here
});


import { Template } from 'meteor/templating';
import { ReactiveVar } from "meteor/reactive-var";
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { Users } from '../../../api/user/UserCollection';
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
    console.log(Template.instance());
    return '';
  },
});

Template.Favorite_Academic_Plan_Viewer_Widget.events({
  focus: function focus(event, instance) {
    event.preventDefault();
    console.log(event, instance);
  },
});

Template.Favorite_Academic_Plan_Viewer_Widget.onRendered(function favoriteAcademicPlanViewerWidgetOnRendered() {
  this.$('.dropdown').dropdown({
  });
});

Template.Favorite_Academic_Plan_Viewer_Widget.onDestroyed(function favoriteAcademicPlanViewerWidgetOnDestroyed() {
  // add your statement here
});


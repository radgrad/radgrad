import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getRouteUserName } from '../shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';

Template.Student_Card_Explorer_CareerGoals_Widget.onCreated(function studentCardExplorerCareergoalsWidgetOnCreated() {
  this.hidden = new ReactiveVar(true);
});

function availableCareerGoals() {
  const careers = CareerGoals.find({}).fetch();
  if (getRouteUserName()) {
    const profile = Users.getProfile(getRouteUserName());
    const careerGoalIDs = profile.careerGoalIDs;
    return _.filter(careers, c => _.indexOf(careerGoalIDs, c._id) !== -1);
  }
  return careers;
}

function matchingCareerGoals() {
  const allCareers = availableCareerGoals();
  if (getRouteUserName()) {
    const profile = Users.getProfile(getRouteUserName());
    const interestIDs = Users.getInterestIDs(profile.userID);
    const preferred = new PreferredChoice(allCareers, interestIDs);
    return preferred.getOrderedChoices();
  }
  return allCareers;
}

Template.Student_Card_Explorer_CareerGoals_Widget.helpers({
  careers() {
    return matchingCareerGoals();
  },
  hidden() {
    return Template.instance().hidden.get();
  },

});

Template.Student_Card_Explorer_CareerGoals_Widget.events({
  'click .showHidden': function clickShowHidden(event) {
    event.preventDefault();
    Template.instance().hidden.set(false);
  },
  'click .hideHidden': function clickHideHidden(event) {
    event.preventDefault();
    Template.instance().hidden.set(true);
  },
});

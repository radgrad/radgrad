import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { getRouteUserName } from '../shared/route-user-name';
import { getUserIdFromRoute } from './get-user-id-from-route';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';

function availableCareerGoals() {
  const careers = CareerGoals.findNonRetired({});
  if (getRouteUserName()) {
    const studentID = getUserIdFromRoute();
    const favorites = FavoriteCareerGoals.findNonRetired({ studentID });
    const careerGoalIDs = _.map(favorites, (f) => f.careerGoalID);
    return _.filter(careers, c => !_.includes(careerGoalIDs, c._id));
  }
  return careers;
}

function matchingCareerGoals() {
  const allCareers = availableCareerGoals();
  if (getRouteUserName()) {
    const studentID = getUserIdFromRoute();
    const favorites = FavoriteInterests.findNonRetired({ studentID });
    const interestIDs = _.map(favorites, (f) => f.interestID);
    const preferred = new PreferredChoice(allCareers, interestIDs);
    return preferred.getOrderedChoices();
  }
  return allCareers;
}

Template.Card_Explorer_CareerGoals_Widget.helpers({
  careers() {
    return matchingCareerGoals();
  },
  itemCount() {
    return matchingCareerGoals().length;
  },
  noInterests() {
    if (getRouteUserName()) {
      const studentID = getUserIdFromRoute();
      return FavoriteInterests.findNonRetired({ studentID }).length === 0;
    }
    return true;
  },
  noCareerGoals() {
    if (getRouteUserName()) {
      const studentID = getUserIdFromRoute();
      return FavoriteCareerGoals.findNonRetired({ studentID }).length === 0;
    }
    return true;
  },
});

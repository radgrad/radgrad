import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getRouteUserName } from '../shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';

function availableCareerGoals() {
  const careers = CareerGoals.find({}).fetch();
  if (getRouteUserName()) {
    const profile = Users.getProfile(getRouteUserName());
    const careerGoalIDs = profile.careerGoalIDs;
    return _.filter(careers, c => !_.includes(careerGoalIDs, c._id));
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
  itemCount() {
    return matchingCareerGoals().length;
  },
  noInterests() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      const interestIDs = Users.getInterestIDs(profile.userID);
      return interestIDs.length === 0;
    }
    return true;
  },
  noCareerGoals() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return profile.careerGoalIDs.length === 0;
    }
    return true;
  },
});

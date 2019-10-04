import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Users } from '../../../api/user/UserCollection';
import { getRouteUserName } from '../../components/shared/route-user-name';

Template.Card_Explorer_CareerGoals_Page.helpers({
  addedCareerGoals() {
    const addedCareerGoals = [];
    if (getRouteUserName()) {
      const allCareerGoals = CareerGoals.find({}, { sort: { name: 1 } })
        .fetch();
      const profile = Users.getProfile(getRouteUserName());
      _.forEach(allCareerGoals, (careerGoal) => {
        if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
          addedCareerGoals.push({ item: careerGoal, count: 1 });
        }
      });
    }
    return addedCareerGoals;
  },
  nonAddedCareerGoals() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      const allCareerGoals = CareerGoals.find({}, { sort: { name: 1 } })
        .fetch();
      const nonAddedCareerGoals = _.filter(allCareerGoals, function (careerGoal) {
        if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
          return false;
        }
        return true;
      });
      return nonAddedCareerGoals;
    }
    return CareerGoals.findNonRetired({}, { sort: { name: 1 } });
  },
});

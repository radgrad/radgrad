import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { getRouteUserName } from '../../components/shared/route-user-name';
import { Interests } from '../../../api/interest/InterestCollection';
import { Users } from '../../../api/user/UserCollection';

Template.Card_Explorer_Interests_Page.helpers({
  addedInterests() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      const interests = Interests.find({}).fetch();
      return _.filter(interests, int => _.includes(profile.interestIDs, int._id));
    }
    return [];
  },
  addedCareerInterests() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      const allInterests = Users.getInterestIDsByType(profile.userID);
      return _.map(allInterests[1], (interest) => Interests.findDoc(interest));
    }
    return [];
  },
  nonAddedInterests() {
    const interests = Interests.find({}).fetch();
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      return _.filter(interests, int => !_.includes(profile.interestIDs, int._id));
    }
    return interests;
  },
});

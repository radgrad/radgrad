import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getRouteUserName } from './route-user-name';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';

function availableInterests() {
  let interests = Interests.findNonRetired();
  if (getRouteUserName()) {
    const profile = Users.getProfile(getRouteUserName());
    const allInterests = Users.getInterestIDsByType(profile.userID);
    interests = _.filter(interests, i => !_.includes(allInterests[0], i._id));
    interests = _.filter(interests, i => !_.includes(allInterests[1], i._id));
  }
  return interests;
}

Template.Card_Explorer_Interests_Widget.helpers({
  interests() {
    return availableInterests();
  },
  itemCount() {
    return availableInterests().length;
  },
  noInterests() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      const interests = Users.getInterestIDs(profile.userID);
      return interests.length === 0;
    }
    return false;
  },
});

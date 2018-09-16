import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getRouteUserName } from '../shared/route-user-name';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';

function availableInterests() {
  const interests = Interests.find({}).fetch();
  if (getRouteUserName()) {
    const profile = Users.getProfile(getRouteUserName());
    const interestIDs = profile.interestIDs;
    return _.filter(interests, i => !_.includes(interestIDs, i._id));
  }
  return interests;
}

Template.Student_Card_Explorer_Interests_Widget.helpers({
  interests() {
    return availableInterests();
  },
  itemCount() {
    return availableInterests().length;
  },
});

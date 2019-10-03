import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { getGroupName } from '../../components/shared/route-group-name';

Template.Card_Explorer_Opportunities_Page.helpers({
  addedOpportunities() {
    const studentID = getUserIdFromRoute();
    const favorites = FavoriteOpportunities.find({ studentID }).fetch();
    return _.map(favorites, (f) => ({ item: Opportunities.findDoc(f.opportunityID), count: 1 }));
  },
  nonAddedOpportunities() {
    const allOpportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
    const userID = getUserIdFromRoute();
    const group = getGroupName();
    if (group === 'faculty') {
      return _.filter(allOpportunities, o => o.sponsorID !== userID);
    } else if (group === 'student') {
      const favorites = FavoriteOpportunities.find({ studentID: userID }).fetch();
      const favoriteIDs = _.map(favorites, (f) => f.opportunityID);
      const nonAddedOpportunities = _.filter(allOpportunities, function (opportunity) {
        return !_.includes(favoriteIDs, opportunity._id);
      });
      return nonAddedOpportunities;
    }
    return allOpportunities;
  },
});

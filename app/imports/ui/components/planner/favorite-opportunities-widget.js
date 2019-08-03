import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

Template.Favorite_Opportunities_Widget.helpers({
  getOpportunities() {
    const studentID = getUserIdFromRoute();
    const favorites = FavoriteOpportunities.findNonRetired({ studentID });
    return _.map(favorites, (f) => Opportunities.findDoc(f.opportunityID));
  },
  opportunityExplorerRouteName() {
    return RouteNames.studentCardExplorerOpportunitiesPageRouteName;
  },
});

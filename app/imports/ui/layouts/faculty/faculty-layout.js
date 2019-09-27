import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import * as RouteNames from '../../../startup/client/router.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Faculty_Layout.helpers({
  secondMenuItems() {
    let openRequests = VerificationRequests.find({ status: VerificationRequests.OPEN }).fetch();
    openRequests = _.filter(openRequests, (request) => {
      const oi = OpportunityInstances.findNonRetired(request.opportunityInstanceID);
      if (oi.length > 0) {
        return Opportunities.findDoc(oi[0].opportunityID).sponsorID === getUserIdFromRoute();
      }
      return false;
    });

    const numRequests = openRequests.length;
    let requestsLabel = 'Verification';
    if (numRequests > 0) {
      requestsLabel = `${requestsLabel} (${numRequests})`;
    }
    return [
      { label: 'Home',
        route: RouteNames.facultyHomePageRouteName,
        regex: 'home' },
      { label: 'Manage Opportunities',
        route: RouteNames.facultyManageOpportunitiesPageRouteName,
        regex: 'manage-opportunities' },
      { label: requestsLabel,
        route: RouteNames.facultyVerificationPageRouteName,
        regex: 'verification' },
      { label: 'Explorer',
        route: RouteNames.facultyExplorerPageRouteName,
        regex: 'explorer' },
      { label: 'Scoreboard',
        route: RouteNames.facultyScoreboardPageRouteName,
        regex: 'scoreboard' },
    ];
  },
  secondMenuLength() {
    return 'five';
  },
});

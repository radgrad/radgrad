import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Student_Card_Explorer_Opportunities_Page.helpers({
  addedOpportunities() {
    const addedOpportunities = [];
    const allOpportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
    const userID = getUserIdFromRoute();
    _.forEach(allOpportunities, (opportunity) => {
      const oi = OpportunityInstances.find({
        studentID: userID,
        opportunityID: opportunity._id,
      }).fetch();
      if (oi.length > 0) {
        addedOpportunities.push(opportunity);
      }
    });
    return addedOpportunities;
  },
  nonAddedOpportunities() {
    const allOpportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
    const userID = getUserIdFromRoute();
    const nonAddedOpportunities = _.filter(allOpportunities, function (opportunity) {
      const oi = OpportunityInstances.find({
        studentID: userID,
        opportunityID: opportunity._id,
      }).fetch();
      if (oi.length > 0) {
        return false;
      }
      return true;
    });
    return nonAddedOpportunities;
  },
});

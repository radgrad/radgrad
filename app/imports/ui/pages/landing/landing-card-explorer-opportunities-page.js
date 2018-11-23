import { Template } from 'meteor/templating';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

Template.Landing_Card_Explorer_Opportunities_Page.helpers({
  addedOpportunities() {
    return Opportunities.findNonRetired({}, { sort: { name: 1 } });
  },
  nonAddedOpportunities() {
    return [];
  },
});

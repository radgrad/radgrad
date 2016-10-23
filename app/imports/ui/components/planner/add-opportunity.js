import { Template } from 'meteor/templating';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';

Template.Add_Opportunity.helpers({
  opportunityArgs(opportunity) {
    return {
      opportunity,
    };
  },
  opportunities() {
    return Opportunities.find().fetch();
  },
});

Template.Add_Opportunity.events({
  // add your events here
});

Template.Add_Opportunity.onCreated(function () {
  // add your statement here
});

Template.Add_Opportunity.onRendered(function () {
  // add your statement here
});

Template.Add_Opportunity.onDestroyed(function () {
  // add your statement here
});


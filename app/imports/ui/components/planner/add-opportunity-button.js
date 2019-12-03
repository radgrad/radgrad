import { Template } from 'meteor/templating';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { plannerKeys, resetDetails } from './academic-plan';
import { getRouteUserName } from '../shared/route-user-name';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';

Template.Add_Opportunity_Button.onCreated(function addOpportunityButtonOnCreated() {
  this.state = this.data.dictionary;
});

Template.Add_Opportunity_Button.helpers({
  equals(a, b) {
    return a === b;
  },
  id() {
    return this.opportunity._id;
  },
  name() {
    const { name } = this.opportunity;
    if (name.length > 15) {
      return `${name.substring(0, 12)}...`;
    }
    return name;
  },
  slug() {
    const slug = Slugs.getNameFromID(this.opportunity.slugID);
    return slug;
  },
});

Template.Add_Opportunity_Button.events({
  'click .removeFromPlan': function clickItemRemoveFromPlan(event) {
    event.preventDefault();
    const { opportunity } = this;
    const oi = Template.instance().state.get(plannerKeys.detailsOpportunity);
    const collectionName = OpportunityInstances.getCollectionName();
    const template = Template.instance();
    removeItMethod.call({ collectionName, instance: oi._id }, (error) => {
      if (!error) {
        resetDetails(template.state);
      }
    });
    const interactionData = {
      username: getRouteUserName(), type: 'removeOpportunity',
      typeData: Slugs.getNameFromID(opportunity.slugID),
    };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.log('Error creating UserInteraction', err);
      }
    });
  },
});

Template.Add_Opportunity_Button.onRendered(function addOpportunityButtonOnRendered() {

});

Template.Add_Opportunity_Button.onDestroyed(function addOpportunityButtonOnDestroyed() {
  // add your statement here
});

import { Template } from 'meteor/templating';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { opportunityInstancesRemoveItMethod } from '../../../api/opportunity/OpportunityInstanceCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { plannerKeys } from './academic-plan';

// /** @module ui/components/planner/Add_Opportunity_Button */

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
    const name = this.opportunity.name;
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
    const opportunity = this.opportunity;
    const oi = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
    opportunityInstancesRemoveItMethod.call({ id: oi._id }, (error) => {
      if (!error) {
        Template.instance().state.set(plannerKeys.detailCourse, null);
        Template.instance().state.set(plannerKeys.detailCourseInstance, null);
        Template.instance().state.set(plannerKeys.detailOpportunity, opportunity);
        Template.instance().state.set(plannerKeys.detailOpportunityInstance, null);
        Template.instance().$('.chooseSemester').popup('hide');
      }
    });
  },
});

Template.Add_Opportunity_Button.onRendered(function addOpportunityButtonOnRendered() {
  const template = this;
  template.$('.chooseSemester')
      .popup({
        on: 'click',
      });
});

Template.Add_Opportunity_Button.onDestroyed(function addOpportunityButtonOnDestroyed() {
  // add your statement here
});


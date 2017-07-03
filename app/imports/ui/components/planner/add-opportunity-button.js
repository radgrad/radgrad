import { Template } from 'meteor/templating';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { plannerKeys } from './academic-plan';
import { getRouteUserName } from '../shared/route-user-name';
import { appLog } from '../../../api/log/AppLogCollection';

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
    const id = Template.instance().state.get(plannerKeys.detailOpportunityInstance);
    const collectionName = OpportunityInstances.getCollectionName();
    console.log(id);
    const semester = Semesters.toString(id.semesterID);
    removeItMethod.call({ collectionName, instance: id }, (error) => {
      if (!error) {
        Template.instance().state.set(plannerKeys.detailCourse, null);
        Template.instance().state.set(plannerKeys.detailCourseInstance, null);
        Template.instance().state.set(plannerKeys.detailOpportunity, opportunity);
        Template.instance().state.set(plannerKeys.detailOpportunityInstance, null);
        Template.instance().$('.chooseSemester').popup('hide');
      }
    });
    const message = `${getRouteUserName()} removed ${opportunity.name} in ${semester} from their Degree Plan.`;
    appLog.info(message);
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


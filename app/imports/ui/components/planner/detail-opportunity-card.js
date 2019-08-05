import { Template } from 'meteor/templating';
import { plannerKeys } from './academic-plan';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';

Template.Detail_Opportunity_Card.onCreated(function detailopportunitycardOnCreated() {
  this.state = this.data.dictionary;
});

Template.Detail_Opportunity_Card.helpers({
  futureInstance() {
    const currentSemester = Semesters.getCurrentSemesterDoc();
    // eslint-disable-next-line max-len
    const instanceSemester = Semesters.findDoc(Template.instance().state.get(plannerKeys.detailsOpportunity).semesterID);
    return instanceSemester.semesterNumber >= currentSemester.semesterNumber;
  },
  ice() {
    return Template.instance().state.get(plannerKeys.detailsOpportunity).ice;
  },
  name() {
    // eslint-disable-next-line max-len
    const opportunity = Opportunities.findDoc(Template.instance().state.get(plannerKeys.detailsOpportunity).opportunityID);
    return opportunity.name;
  },
  opportunity() {
    // eslint-disable-next-line max-len
    const opportunity = Opportunities.findDoc(Template.instance().state.get(plannerKeys.detailsOpportunity).opportunityID);
    return opportunity;
  },
});

Template.Detail_Opportunity_Card.events({
  // add your events here
});

Template.Detail_Opportunity_Card.onRendered(function detailopportunitycardOnRendered() {
  // add your statement here
});

Template.Detail_Opportunity_Card.onDestroyed(function detailopportunitycardOnDestroyed() {
  // add your statement here
});


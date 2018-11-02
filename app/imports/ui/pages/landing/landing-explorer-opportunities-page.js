import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Teasers } from '../../../api/teaser/TeaserCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection.js';

function opportunityType(opportunity) {
  const oppType = opportunity.opportunityTypeID;
  const oppSlug = OpportunityTypes.findSlugByID(oppType);
  return OpportunityTypes.findDocBySlug(oppSlug).name;
}

function semesters(opportunity) {
  const semesterIDs = opportunity.semesterIDs;
  return _.map(semesterIDs, (semID) => Semesters.toString(semID));
}

function teaser(opp) {
  const oppTeaser = Teasers.find({ opportunityID: opp._id }).fetch();
  return oppTeaser[0];
}

Template.Landing_Explorer_Opportunities_Page.helpers({
  addedOpportunities() {
    const opps = Opportunities.find({}, { sort: { name: 1 } }).fetch();
    return _.filter(opps, (o) => !o.retired);
  },
  completed() {
    return false;
  },
  descriptionPairs(opportunity) {
    return [
      { label: 'Opportunity Type', value: opportunityType(opportunity) },
      { label: 'Semesters', value: semesters(opportunity) },
      { label: 'Description', value: opportunity.description },
      { label: 'Interests', value: opportunity.interestIDs },
      { label: 'ICE', value: opportunity.ice },
      { label: 'Teaser', value: teaser(opportunity) },
    ];
  },
  nonAddedOpportunities() {
    return [];
  },
  opportunity() {
    const opportunitySlugName = FlowRouter.getParam('opportunity');
    const slug = Slugs.findDoc({ name: opportunitySlugName });
    const opportunity = Opportunities.findDoc({ slugID: slug._id });
    return opportunity;
  },
  reviewed() {
    return false;
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  socialPairs(opportunity) { // eslint-disable-line
    return [];
  },
});


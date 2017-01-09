import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection.js';
import { makeLink } from '../../components/admin/datamodel-utilities';
import { Users } from '../../../api/user/UserCollection.js';

function interestedUsers(opportunity) {
  const interested = [];
  const ci = OpportunityInstances.find({
    opportunityID: opportunity._id,
  }).fetch();
  _.map(ci, (c) => {
    if (!_.includes(interested, c.studentID)) {
      interested.push(c.studentID);
    }
  });
  return interested;
}

function numUsers(opportunity) {
  return interestedUsers(opportunity).length;
}

function opportunityType(opportunity) {
  const oppType = opportunity.opportunityTypeID;
  const oppSlug = OpportunityTypes.findSlugByID(oppType);
  return OpportunityTypes.findDocBySlug(oppSlug).name;
}

function sponsor(opportunity) {
  return Users.getFullName(opportunity.sponsorID);
}

function semesters(opportunity) {
  const semesterNames = [];
  const semesterIDs = opportunity.semesterIDs;
  _.map(semesterIDs, (semID) => {
    semesterNames.push(Semesters.toString(semID));
  });
  return semesterNames;
}

Template.Student_Explorer_Opportunities_Page.helpers({
  opportunity() {
    const opportunitySlugName = FlowRouter.getParam('opportunity');
    const slug = Slugs.find({ name: opportunitySlugName }).fetch();
    const opportunity = Opportunities.find({ slugID: slug[0]._id }).fetch();
    return opportunity[0];
  },
  opportunities() {
    return Opportunities.find({}, { sort: { name: 1 } }).fetch();
  },
  opportunityName(opportunity) {
    return opportunity.name;
  },
  count() {
    return Opportunities.count();
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(opportunity) {
    return [
      { label: 'Opportunity Type', value: opportunityType(opportunity) },
      { label: 'Semesters', value: semesters(opportunity) },
      { label: 'Event Date', value: opportunity.eventDate },
      { label: 'Sponsor', value: sponsor(opportunity) },
      { label: 'Description', value: opportunity.description },
      { label: 'More Information', value: makeLink(opportunity.moreInformation) },
      { label: 'Interests', value: _.sortBy(Interests.findNames(opportunity.interestIDs)) },
      { label: 'student(s)', value: numUsers(opportunity), type: 'amount' },
      { label: 'Students', value: interestedUsers(opportunity), type: 'list' },
    ];
  },
});

Template.Student_Explorer_Opportunities_Page.onCreated(function studentExplorerOpportunitiesPageOnCreated() {
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityTypes.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
});

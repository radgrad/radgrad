import { Template } from 'meteor/templating';
import { Interests } from '../../../api/interest/InterestCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { makeLink } from './datamodel-utilities';
import { moment } from 'meteor/momentjs:moment';
import * as FormUtils from './form-fields/form-field-utilities.js';

Template.List_Opportunities_Widget.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(OpportunityTypes.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

function numReferences(opportunity) {
  let references = 0;
  [OpportunityInstances].forEach(function (entity) {
    entity.find().forEach(function (doc) {
      if (doc.opportunityID === opportunity._id) {
        references += 1;
      }
    });
  });
  return references;
}

Template.List_Opportunities_Widget.helpers({
  opportunities() {
    return Opportunities.find({}, { sort: { name: 1 } });
  },
  count() {
    return Opportunities.count();
  },
  deleteDisabled(opportunity) {
    return (numReferences(opportunity) > 0) ? 'disabled' : '';
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(opportunity) {
    return [
      { label: 'Description', value: opportunity.description },
      { label: 'Opportunity Type', value: OpportunityTypes.findDoc(opportunity.opportunityTypeID).name },
      { label: 'Sponsor', value: Slugs.findDoc(Users.findDoc(opportunity.sponsorID).slugID).name },
      { label: 'Interests', value: _.sortBy(Interests.findNames(opportunity.interestIDs)) },
      { label: 'Semesters', value: _.map(opportunity.semesterIDs, id => Semesters.toString(id)) },
      { label: 'Icon', value: makeLink(opportunity.iconURL) },
      { label: 'Event Date', value: moment(opportunity.eventDate).format('lll') },
      { label: 'More Information', value: makeLink(opportunity.moreInformation) },
      { label: 'ICE', value: `${opportunity.ice.i}, ${opportunity.ice.c}, ${opportunity.ice.e}` },
      { label: 'References', value: `${numReferences(opportunity)}` },
    ];
  },
});

Template.List_Opportunities_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event) {
    event.preventDefault();
    const id = event.target.value;
    Opportunities.removeIt(id);
  },
});

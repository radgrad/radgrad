import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Interests } from '../../../api/interest/InterestCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { isInRole } from '../../utilities/template-helpers';

function numReferences() {
  // This code made the opportunities page on radgrad.ics.hawaii.edu unresponsive.
  // It is deleted until we decide we need a fast implementation.
  // let references = 0;
  // [OpportunityInstances].forEach(function (entity) {
  //   entity.find().forEach(function (doc) {
  //     if (doc.opportunityID === opportunity._id) {
  //       references += 1;
  //     }
  //   });
  // });
  return 0;
}

Template.List_Opportunities_Widget.helpers({
  facultyOpportunities() {
    return Opportunities.find({ sponsorID: getUserIdFromRoute() }, { sort: { name: 1 } });
  },
  opportunities() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'faculty') {
      return Opportunities.find({ sponsorID: { $ne: getUserIdFromRoute() } }, { sort: { name: 1 } });
    }
    return Opportunities.find({}, { sort: { name: 1 } });
  },
  count() {
    return Opportunities.find({ sponsorID: { $ne: getUserIdFromRoute() } }).count();
  },
  deleteDisabled(opportunity) {
    const group = FlowRouter.current().route.group.name;
    if (group === 'faculty') {
      if (opportunity.sponsorID !== getUserIdFromRoute()) {
        return 'disabled';
      }
    }
    return (numReferences(opportunity) > 0) ? 'disabled' : '';
  },
  facultyCount() {
    return Opportunities.find({ sponsorID: getUserIdFromRoute() }).count();
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  isInRole,
  updateDisabled(opportunity) {
    const group = FlowRouter.current().route.group.name;
    if (group === 'faculty') {
      if (opportunity.sponsorID !== getUserIdFromRoute()) {
        return 'disabled';
      }
    }
    return '';
  },
  descriptionPairs(opportunity) {
    return [
      { label: 'Description', value: opportunity.description },
      { label: 'Opportunity Type', value: OpportunityTypes.findDoc(opportunity.opportunityTypeID).name },
      { label: 'Sponsor', value: Users.getProfile(opportunity.sponsorID).username },
      { label: 'Interests', value: _.sortBy(Interests.findNames(opportunity.interestIDs)) },
      { label: 'Semesters', value: _.map(opportunity.semesterIDs, id => Semesters.toString(id)) },
      { label: 'ICE', value: `${opportunity.ice.i}, ${opportunity.ice.c}, ${opportunity.ice.e}` },
      { label: 'Retired', value: opportunity.retired ? 'true' : 'false' },
    ];
  },
  titleICE(opportunity) {
    return `ICE: ${opportunity.ice.i}/${opportunity.ice.c}/${opportunity.ice.e}`;
  },
});

Template.List_Opportunities_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'OpportunityCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});

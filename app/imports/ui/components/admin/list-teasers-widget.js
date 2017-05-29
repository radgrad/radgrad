import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { teasersRemoveItMethod } from '../../../api/teaser/TeaserCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { makeLink } from './datamodel-utilities';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/List_Teasers_Widget */

function numReferences() {
  // currently nothing refers to a Teaser, but maybe in future something will.
  return 0;
}

function opportunity(teaser) {
  if (teaser.opportunityID) {
    return Opportunities.findDoc(teaser.opportunityID).name;
  }
  return '';
}

Template.List_Teasers_Widget.helpers({
  teasers() {
    return Teasers.find({}, { sort: { title: 1 } });
  },
  count() {
    return Teasers.count();
  },
  deleteDisabled(teaser) {
    return (numReferences(teaser) > 0) ? 'disabled' : '';
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(teaser) {
    return [
      { label: 'Description', value: teaser.description },
      { label: 'Author', value: teaser.author },
      { label: 'Duration', value: teaser.duration },
      { label: 'Interests', value: _.sortBy(Interests.findNames(teaser.interestIDs)) },
      { label: 'URL', value: makeLink(teaser.url) },
      { label: 'Opportunity', value: opportunity(teaser) },
    ];
  },
});

Template.List_Teasers_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event) {
    event.preventDefault();
    const id = event.target.value;
    teasersRemoveItMethod.call({ id }, (error) => {
      if (error) {
        console.log('Error removing Teaser', error);
      }
    });
  },
});

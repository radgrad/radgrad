import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

function numReferences(opportunityType) {
  let references = 0;
  Opportunities.find().forEach(function (doc) {
    if (_.includes(doc.opportunityTypeID, opportunityType._id)) {
      references += 1;
    }
  });
  return references;
}

Template.List_Opportunity_Types_Widget.onCreated(function listOpportunityTypesOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

Template.List_Opportunity_Types_Widget.helpers({
  opportunityTypes() {
    const items = OpportunityTypes.find({}, { sort: { name: 1 } }).fetch();
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(items, startIndex, endIndex);
  },
  count() {
    return OpportunityTypes.count();
  },
  deleteDisabled(interest) {
    return (numReferences(interest) > 0) ? 'disabled' : '';
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(opportunityType) {
    return [
      { label: 'Name', value: opportunityType.name },
      { label: 'Slug', value: `${Slugs.findDoc(opportunityType.slugID).name}` },
      { label: 'Description', value: opportunityType.description },
      { label: 'References', value: `${numReferences(opportunityType)}` },
    ];
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return OpportunityTypes;
  },
  retired(item) {
    return item.retired;
  },
});

Template.List_Opportunity_Types_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: OpportunityTypes.getCollectionName(), instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});

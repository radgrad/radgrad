import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Interests } from '../../../api/interest/InterestCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';

function numReferences(interestType) {
  let references = 0;
  Interests.find().forEach(function (doc) {
    if (_.includes(doc.interestTypeID, interestType._id)) {
      references += 1;
    }
  });
  return references;
}

Template.List_Interest_Types_Widget.helpers({
  interestTypes() {
    return InterestTypes.find({}, { sort: { name: 1 } });
  },
  count() {
    return InterestTypes.count();
  },
  deleteDisabled(interest) {
    return (numReferences(interest) > 0) ? 'disabled' : '';
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(interestType) {
    return [
      { label: 'Name', value: interestType.name },
      { label: 'Slug', value: `${Slugs.findDoc(interestType.slugID).name}` },
      { label: 'Description', value: interestType.description },
      { label: 'References', value: `${numReferences(interestType)}` },
    ];
  },
});

Template.List_Interest_Types_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'InterestCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});

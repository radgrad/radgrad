import { Template } from 'meteor/templating';
import { Slugs } from '../../../api/slug/SlugCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import * as FormUtils from '../form-fields/form-field-utilities.js';

Template.List_Slugs_Widget.helpers({
  slugs() {
    return Slugs.find({}, { sort: { name: 1 } });
  },
  count() {
    return Slugs.count();
  },
  deleteDisabled() {
    return 'disabled';
  },
  name(slug) {
    return `${slug.name}: ${slug.entityName}`;
  },
  descriptionPairs(slug) {
    return [
      { label: 'Name', value: `${slug.name}` },
      { label: 'Entity Name', value: `${slug.entityName}` },
      { label: 'Entity ID', value: `${slug.entityID}` },
    ];
  },
});

Template.List_Slugs_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: Slugs.getCollectionName(), instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});

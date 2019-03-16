import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Slugs } from '../../../api/slug/SlugCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import * as FormUtils from '../form-fields/form-field-utilities.js';

Template.List_Slugs_Widget.onCreated(function listSlugsOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

Template.List_Slugs_Widget.helpers({
  slugs() {
    const items = Slugs.find({}, { sort: { name: 1 } }).fetch();
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(items, startIndex, endIndex);
  },
  count() {
    return Slugs.count();
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
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return Slugs;
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

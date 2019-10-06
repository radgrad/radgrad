import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { makeYoutubeLink } from './datamodel-utilities';
import * as FormUtils from '../form-fields/form-field-utilities.js';

function numReferences() {
  // currently nothing refers to a Teaser, but maybe in future something will.
  return 0;
}

function opportunity(teaser) {
  if (teaser.targetSlugID) {
    return Slugs.findDoc(teaser.targetSlugID).name;
  }
  return '';
}

Template.List_Teasers_Widget.onCreated(function listTeasersOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

Template.List_Teasers_Widget.helpers({
  teasers() {
    const items = Teasers.find({}, { sort: { title: 1 } }).fetch();
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(items, startIndex, endIndex);
  },
  count() {
    return Teasers.count();
  },
  deleteDisabled(teaser) {
    return (numReferences(teaser) > 0) ? 'disabled' : '';
  },
  slugName(slugID) {
    return slugID && Slugs.hasSlug(slugID) && Slugs.findDoc(slugID).name;
  },
  descriptionPairs(teaser) {
    return [
      { label: 'Description', value: teaser.description },
      { label: 'Author', value: teaser.author },
      { label: 'Duration', value: teaser.duration },
      { label: 'Interests', value: _.sortBy(Interests.findNames(teaser.interestIDs)) },
      { label: 'Youtube ID', value: makeYoutubeLink(teaser.url) },
      { label: 'Target Slug', value: opportunity(teaser) },
      { label: 'Retired', value: teaser.retired ? 'True' : 'False' },
    ];
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return Teasers;
  },
  retired(item) {
    return item.retired;
  },
});

Template.List_Teasers_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'TeaserCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});

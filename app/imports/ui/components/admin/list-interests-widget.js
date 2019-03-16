import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';

function numReferences(interest) {
  let references = 0;
  // TODO Add profiles below? Move this into Interests class?
  [CareerGoals, Courses, Opportunities, Teasers].forEach(function (entity) {
    entity.find().forEach(function (doc) {
      if (_.includes(doc.interestIDs, interest._id)) {
        references += 1;
      }
    });
  });
  return references;
}
Template.List_Interests_Widget.onCreated(function listInterestsOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

Template.List_Interests_Widget.helpers({
  interests() {
    const items = Interests.find({}, { sort: { name: 1 } }).fetch();
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(items, startIndex, endIndex);
  },
  count() {
    return Interests.count();
  },
  deleteDisabled(interest) {
    return (numReferences(interest) > 0) ? 'disabled' : '';
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(interest) {
    return [
      { label: 'Description', value: interest.description },
      { label: 'Interest Type', value: InterestTypes.findDoc(interest.interestTypeID).name },
      { label: 'References', value: `${numReferences(interest)}` },
    ];
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return Interests;
  },
});

Template.List_Interests_Widget.events({
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

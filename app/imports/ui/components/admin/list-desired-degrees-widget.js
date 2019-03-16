import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

function numReferences(desiredDegree) {
  return AcademicPlans.find({ degreeID: desiredDegree._id }).count();
}
Template.List_Desired_Degrees_Widget.onCreated(function listDesiredDegreesOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});
Template.List_Desired_Degrees_Widget.helpers({
  desiredDegrees() {
    const items = DesiredDegrees.find({}, { sort: { name: 1 } }).fetch();
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(items, startIndex, endIndex);
  },
  count() {
    return DesiredDegrees.count();
  },
  desiredDegreeTitle(desiredDegree) {
    return `${desiredDegree.name}: ${desiredDegree.shortName}`;
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  deleteDisabled(desiredDegree) {
    return (numReferences(desiredDegree) > 0) ? 'disabled' : '';
  },
  descriptionPairs(desiredDegree) {
    return [
      { label: 'Name', value: desiredDegree.name },
      { label: 'Short Name', value: desiredDegree.shortName },
      { label: 'Description', value: desiredDegree.description },
      { label: 'References', value: `Academic Plans: ${numReferences(desiredDegree)}` },
      { label: 'Retired', value: desiredDegree.retired ? 'True' : 'False' },
    ];
  },
  retired(desiredDegree) {
    return desiredDegree.retired;
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return DesiredDegrees;
  },
});

Template.List_Desired_Degrees_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'DesiredDegreeCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});

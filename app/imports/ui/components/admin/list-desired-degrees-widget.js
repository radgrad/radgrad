import { Template } from 'meteor/templating';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

function numReferences(desiredDegree) {
  return AcademicPlans.find({ degreeID: desiredDegree._id }).count();
}

Template.List_Desired_Degrees_Widget.helpers({
  desiredDegrees() {
    return DesiredDegrees.find({}, { sort: { name: 1 } });
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
    ];
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

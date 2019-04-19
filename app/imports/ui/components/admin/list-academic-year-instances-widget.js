import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from '../form-fields/form-field-utilities';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';

function numReferences(academicYearInstance) { // eslint-disable-line
  return 0;
}

Template.List_Academic_Year_Instances_Widget.onCreated(function listAcademicYearInstancesOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

Template.List_Academic_Year_Instances_Widget.helpers({
  academicYearInstances() {
    const allInstances = AcademicYearInstances.find({}).fetch();
    const sortByYear = _.sortBy(allInstances, function (ayi) {
      return ayi.year;
    });
    const years = _.sortBy(sortByYear, function (ayi) {
      return Users.getProfile(ayi.studentID).username;
    });
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(years, startIndex, endIndex);
  },
  count() {
    return AcademicYearInstances.count();
  },
  deleteDisabled(academicYearInstance) {
    return (numReferences(academicYearInstance) > 0) ? 'disabled' : '';
  },
  name(academicYearInstance) {
    return `${Users.getFullName(academicYearInstance.studentID)} ${academicYearInstance.year}`;
  },
  descriptionPairs(academicYearInstance) {
    return [
      { label: 'Student', value: Users.getFullName(academicYearInstance.studentID) },
      { label: 'Year', value: `${academicYearInstance.year}` },
      { label: 'Retired', value: academicYearInstance.retired ? 'True' : 'False' },
    ];
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return AcademicYearInstances;
  },
  retired(item) {
    return item.retired;
  },
});

Template.List_Academic_Year_Instances_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: AcademicYearInstances.getCollectionName(), instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});

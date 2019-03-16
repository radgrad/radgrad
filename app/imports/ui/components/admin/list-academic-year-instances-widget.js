import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { Users } from '../../../api/user/UserCollection';

function numReferences(academicYearInstance) { // eslint-disable-line
  return 0;
}

Template.List_Academic_Year_Instances_Widget.onCreated(function listAcademicYearInstancesOnCreated() {
  this.itemCount = new ReactiveVar(50);
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
    const endIndex = startIndex + Template.instance().itemCount.get() + 1;
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
    ];
  },
  paginationLabel() {
    const count = AcademicYearInstances.count();
    if (count < Template.instance().itemCount.get()) {
      return 'Showing all';
    }
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return `[ ${startIndex} - ${endIndex} of ${count} ]`;
  },
  paginationEnabled() {
    return AcademicYearInstances.count() > Template.instance().itemCount.get();
  },
  firstDisabled() {
    return Template.instance().itemIndex.get() === 0;
  },
  lastDisabled() {
    const count = AcademicYearInstances.count();
    const index = Template.instance().itemIndex.get();
    const showCount = Template.instance().itemCount.get();
    return (index + showCount) >= count;
  },
});

Template.List_Academic_Year_Instances_Widget.events({
  'click .jsFirst': function jsFirst(event, instance) {
    event.preventDefault();
    instance.itemIndex.set(0);
  },
  'click .jsPrev': function jsFirst(event, instance) {
    event.preventDefault();
    const index = instance.itemIndex.get();
    instance.itemIndex.set(index - instance.itemCount.get());
  },
  'click .jsNext': function jsFirst(event, instance) {
    event.preventDefault();
    const index = instance.itemIndex.get();
    instance.itemIndex.set(index + instance.itemCount.get());
  },
  'click .jsLast': function jsFirst(event, instance) {
    event.preventDefault();
    const count = AcademicYearInstances.count();
    instance.itemIndex.set(count - instance.itemCount.get());
  },
});

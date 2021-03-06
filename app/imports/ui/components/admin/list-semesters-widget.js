import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Slugs } from '../../../api/slug/SlugCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';

function numReferences(semester) {
  let references = 0;
  [CourseInstances, OpportunityInstances].forEach(function (entity) {
    _.forEach(entity.find().fetch(), (e) => {
      if (e.semesterID === semester._id) {
        references++;
      }
    });
  });
  return references;
}

Template.List_Semesters_Widget.onCreated(function listSemestersOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

Template.List_Semesters_Widget.helpers({
  semesters() {
    const items = Semesters.find({}, { sort: { semesterNumber: 1 } }).fetch();
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(items, startIndex, endIndex);
  },
  count() {
    return Semesters.count();
  },
  deleteDisabled(semester) {
    return (numReferences(semester) > 0) ? 'disabled' : '';
  },
  name(semester) {
    return `${Semesters.toString(semester._id, false)} (${numReferences(semester)})`;
  },
  slugName(slugID) {
    return slugID && Slugs.hasSlug(slugID) && Slugs.findDoc(slugID).name;
  },
  descriptionPairs(semester) {
    return [
      { label: 'Semester', value: Semesters.toString(semester._id, false) },
      { label: 'Semester Number', value: `${semester.semesterNumber}` },
      { label: 'References', value: `${numReferences(semester)}` },
      { label: 'Retired', value: semester.retired ? 'True' : 'False' },
    ];
  },
  retired(semester) {
    return semester.retired;
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return Semesters;
  },
});

Template.List_Semesters_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: Semesters.getCollectionName(), instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});

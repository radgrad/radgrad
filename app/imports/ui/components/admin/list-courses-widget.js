import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { makeLink } from './datamodel-utilities';
import * as FormUtils from '../form-fields/form-field-utilities.js';

function numReferences(course) {
  return CourseInstances.find({ courseID: course._id }).count();
}

Template.List_Courses_Widget.onCreated(function listCoursesOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

Template.List_Courses_Widget.helpers({
  courses() {
    const items = Courses.find({}, { sort: { number: 1 } }).fetch();
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(items, startIndex, endIndex);
  },
  count() {
    return Courses.count();
  },
  courseTitle(course) {
    return `${course.number}: ${course.shortName}`;
  },
  slugName(slugID) {
    if (Slugs.isDefined(slugID)) {
      return Slugs.findDoc(slugID).name;
    }
    return '';
  },
  deleteDisabled(course) {
    return (numReferences(course) > 0) ? 'disabled' : '';
  },
  retired(course) {
    return course.retired;
  },
  descriptionPairs(course) {
    return [
      { label: 'Description', value: course.description },
      { label: 'Credit Hours', value: course.creditHrs },
      { label: 'Interests', value: _.sortBy(Interests.findNames(course.interestIDs)) },
      { label: 'Syllabus', value: makeLink(course.syllabus) },
      { label: 'Prerequisites', value: course.prerequisites },
      { label: 'References', value: `Course Instances: ${numReferences(course)}` },
      { label: 'Retired', value: course.retired ? 'True' : 'False' },
    ];
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return Courses;
  },
});

Template.List_Courses_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'CourseCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});

import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { makeLink } from './datamodel-utilities';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as FormUtils from './form-fields/form-field-utilities.js';


function numReferences(course) {
  return CourseInstances.find({ courseID: course._id }).count();
}

Template.List_Courses_Widget.helpers({
  courses() {
    return Courses.find({}, { sort: { number: 1 } });
  },
  count() {
    return Courses.count();
  },
  courseTitle(course) {
    return `${course.number}: ${course.shortName}`;
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  deleteDisabled(course) {
    return (numReferences(course) > 0) ? 'disabled' : '';
  },
  descriptionPairs(course) {
    return [
      { label: 'Description', value: course.description },
      { label: 'Credit Hours:', value: course.creditHrs },
      { label: 'Interests', value: _.sortBy(Interests.findNames(course.interestIDs)) },
      { label: 'Syllabus', value: makeLink(course.syllabus) },
      { label: 'Prerequisites', value: course.prerequisites },
      { label: 'More Information', value: makeLink(course.moreInformation) },
      { label: 'References', value: `Course Instances: ${numReferences(course)}` },

    ];
  },
});

Template.List_Courses_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event) {
    event.preventDefault();
    const id = event.target.value;
    Courses.removeIt(id);
  },
});

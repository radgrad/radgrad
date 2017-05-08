import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { makeLink } from '../../components/admin/datamodel-utilities';

Template.Faculty_Explorer_Courses_Page.helpers({
  addedCourses() {
    return [];
  },
  completed() {
    return false;
  },
  course() {
    const courseSlugName = FlowRouter.getParam('course');
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.find({ slugID: slug[0]._id }).fetch();
    return course[0];
  },
  descriptionPairs(course) {
    return [
      { label: 'Course Number', value: course.number },
      { label: 'Credit Hours', value: course.creditHrs },
      { label: 'Description', value: course.description },
      { label: 'Syllabus', value: makeLink(course.syllabus) },
      { label: 'More Information', value: makeLink(course.moreInformation) },
      { label: 'Interests', value: _.sortBy(Interests.findNames(course.interestIDs)) },
      { label: 'Prerequisites', value: course.prerequisites },
    ];
  },
  nonAddedCourses() {
    return Courses.find({}, { sort: { shortName: 1 } }).fetch();
  },
  reviewed(course) {
    return false;
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
});


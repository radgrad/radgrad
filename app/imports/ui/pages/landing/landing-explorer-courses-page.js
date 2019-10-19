import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { makeLink } from '../../components/admin/datamodel-utilities';

function prerequisites(course) {
  return course.prerequisites;
}

Template.Landing_Explorer_Courses_Page.helpers({
  addedCourses() {
    return Courses.findNonRetired({}, { sort: { shortName: 1 } });
  },
  completed() {
    return false;
  },
  course() {
    const courseSlugName = FlowRouter.getParam('course');
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.findDoc({ slugID: slug[0]._id });
    return course;
  },
  descriptionPairs(course) {
    return [
      { label: 'Course Number', value: course.number },
      { label: 'Credit Hours', value: course.creditHrs },
      { label: 'Description', value: course.description },
      { label: 'Syllabus', value: makeLink(course.syllabus) },
      { label: 'Interests', value: _.sortBy(Interests.findNames(course.interestIDs)) },
      { label: 'Prerequisites', value: prerequisites(course) },
    ];
  },
  nonAddedCourses() {
    return [];
  },
  reviewed(course) { // eslint-disable-line
    return false;
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
});

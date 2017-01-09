import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { makeLink } from '../../components/admin/datamodel-utilities';
import { Users } from '../../../api/user/UserCollection.js';

function interestedUsers(course) {
  const interested = [];
  let count = 0;
  const ci = CourseInstances.find({
    courseID: course._id,
  }).fetch();
  _.map(ci, (c) => {
    if (!_.includes(interested, c.studentID)){
      interested.push(c.studentID);
    }
  });
  return interested;
}

function numUsers(course) {
  return interestedUsers(course).length;
}

Template.Student_Explorer_Courses_Page.helpers({
  course() {
    const courseSlugName = FlowRouter.getParam('course');
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.find( {slugID: slug[0]._id } ).fetch();
    return course[0];
  },
  courses() {
    const allCourses = Courses.find().fetch();
    const courses = [];
    _.map(allCourses, (course) => {
      if (course.shortName !== 'Non-CS Course') {
        courses.push(course);
      }
    });
    return courses;
  },
  courseName(course) {
    return course.shortName;
  },
  count() {
    return Courses.count() - 1;
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(course) {
    return [
      { label: 'Course Number', value: course.number },
      { label: 'Credit Hours', value: course.creditHrs },
      { label: 'Prerequisites', value: course.prerequisites },
      { label: 'Description', value: course.description },
      { label: 'Syllabus', value: makeLink(course.syllabus) },
      { label: 'More Information', value: makeLink(course.moreInformation) },
      { label: 'Interests', value: _.sortBy(Interests.findNames(course.interestIDs)) },
      { label: 'student(s)', value: numUsers(course), type: 'amount' },
      { label: 'Students', value: interestedUsers(course), type: 'list' },
    ];
  },
});

Template.Student_Explorer_Courses_Page.onCreated(function studentExplorerCoursesPageOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Interests.getPublicationName());
});

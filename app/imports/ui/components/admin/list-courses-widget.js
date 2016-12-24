import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { makeLink } from './datamodel-utilities';

Template.List_Courses_Widget.onCreated(function listCoursesWidgetOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
});

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

Template.List_Courses_Widget.onRendered(function listCoursesWidgetOnRendered() {
});

Template.List_Courses_Widget.events({
  'click .jsUpdate': function (event, instance) {
    event.preventDefault();
    const courseID = event.target.value;
    instance.data.updateID.set(courseID);
  },
  'click .jsDelete': function (event) {
    event.preventDefault();
    const courseID = event.target.value;
    Courses.removeIt(courseID);
  },
});

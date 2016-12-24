import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';

Template.List_Courses_Widget.onCreated(function listCoursesWidgetOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
});

// function getReferences(courseID) {
//   const references = 0;
//   return `Users: ${references}`;
// }
//
function hasReferences(courseID) {
  const references = courseID;
  return references > 0;
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
  descriptionPairs(course) {
    return [
      { label: 'Description', value: course.description },
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
    if (hasReferences(courseID)) {
      /* global alert */
      alert('Cannot delete an entity that is referred to by another entity.');
    } else {
      Courses.removeIt(courseID);
    }
  },
});

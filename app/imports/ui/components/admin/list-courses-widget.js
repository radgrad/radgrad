import { Template } from 'meteor/templating';
import { Courses } from '../../../api/career/courseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { _ } from 'meteor/erasaur:meteor-lodash';

Template.List_Courses_Widget.onCreated(function listCoursesWidgetOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
});

function getReferences(courseID) {
  let references = 0;
  Users.find().forEach(function (userDoc) {
    if (_.includes(userDoc.courseIDs, courseID)) {
      references += 1;
    }
  });
  return `Users: ${references}`;
}

function hasReferences(courseID) {
  let references = 0;
  Users.find().forEach(function (userDoc) {
    if (_.includes(userDoc.courseIDs, courseID)) {
      references += 1;
    }
  });
  return references > 0;
}

Template.List_Courses_Widget.helpers({
  Courses() {
    return Courses.find({}, { sort: { name: 1 } });
  },
  count() {
    return Courses.count();
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(course) {
    return [
      { label: 'Description', value: course.description },
      { label: 'Interests', value: _.sortBy(Interests.findNames(course.interestIDs)) },
      { label: 'More Information', value: `<a href="${course.moreInformation}">${course.moreInformation}</a>` },
      { label: 'References', value: getReferences(course._id) },
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

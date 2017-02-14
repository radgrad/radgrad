import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

function interestedUsers(course) {
  const interested = [];
  const ci = CourseInstances.find({
    courseID: course._id,
  }).fetch();
  _.map(ci, (c) => {
    if (!_.includes(interested, c.studentID)) {
      interested.push(c.studentID);
    }
  });
  return interested;
}

function numUsers(course) {
  return interestedUsers(course).length;
}

Template.Student_Explorer_Social_Widget.helpers({
  userPicture(user) {
    if (Users.findDoc(user).picture) {
      return Users.findDoc(user).picture;
    }
    return '/images/default-profile-picture.png';
  },
  fullName(user) {
    return `${Users.findDoc(user).firstName} ${Users.findDoc(user).lastName}`;
  },
  socialPairs() {
    const course = this.item;
    return [
      { label: 'students', amount: numUsers(course),
        value: interestedUsers(course) },
    ];
  },
});

Template.Student_Explorer_Social_Widget.events({
});

Template.Student_Explorer_Social_Widget.onCreated(function studentExplorerSocialWidgetOnCreated() {
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.currentItem = () => FlowRouter.getParam('course');
  this.autorun(() => {
    this.subscribe(CourseInstances.getPublicationName(3), this.currentItem());
  });
});

Template.Student_Explorer_Social_Widget.onRendered(function studentExplorerSocialWidgetOnRendered() {
});


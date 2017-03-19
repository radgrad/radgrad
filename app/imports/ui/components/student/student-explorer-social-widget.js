import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '/imports/startup/client/router.js';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';

Template.Student_Explorer_Social_Widget.onCreated(function studentExplorerSocialWidgetOnCreated() {
  this.currentItem = () => FlowRouter.getParam('course');
  this.autorun(() => {
    this.subscribe(CourseInstances.getPublicationName(3), this.currentItem());
  });
});

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
  fullName(user) {
    return Users.getFullName(user);
  },
  socialPairs() {
    const course = this.item;
    return [
      { label: 'students', amount: numUsers(course),
        value: interestedUsers(course) },
    ];
  },
  userPicture(user) {
    if (Users.findDoc(user).picture) {
      return Users.findDoc(user).picture;
    }
    return '/images/default-profile-picture.png';
  },
  usersRouteName() {
    return RouteNames.studentExplorerUsersPageRouteName;
  },
  userUsername(user) {
    return Users.findDoc(user).username;
  },
});

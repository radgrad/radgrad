import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { Users } from '../../../api/user/UserCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';

Template.Student_Explorer_Social_Widget.onCreated(function studentExplorerSocialWidgetOnCreated() {
  this.currentItem = () => FlowRouter.getParam('course');
  this.autorun(() => {
    this.subscribe(CourseInstances.publicationNames.publicStudent, this.currentItem());
  });
});

function interestedUsers(course) {
  const interested = [];
  const ci = CourseInstances.find({
    courseID: course._id,
  }).fetch();
  _.forEach(ci, (c) => {
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
    return Users.getProfile(user).picture || '/images/default-profile-picture.png';
  },
  usersRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerUsersPageRouteName;
    }
    return RouteNames.mentorExplorerUsersPageRouteName;
  },
  userUsername(user) {
    return Users.getProfile(user).username;
  },
});

import { Template } from 'meteor/templating';
import * as RouteNames from '/imports/startup/client/router.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_Explorer_Review_Widget.helpers({
  abbreviateSemester(semester) {
    const semNameYear = semester.split(' ');
    let semName = '';
    switch (semNameYear[0]) {
      case 'Spring':
        semName = 'Spr';
        break;
      case 'Fall':
        semName = 'Fall';
        break;
      case 'Summer':
        semName = 'Sum';
        break;
      default:
        semName = 'N/A';
        break;
    }
    return `${semName} ${semNameYear[1]}`;
  },
  currentUserName() {
    return Users.getFullName(getUserIdFromRoute());
  },
  currentUserPicture() {
    return Users.findDoc(getUserIdFromRoute()).picture;
  },
  reviewData(review) {
    const user = Users.findDoc(review.studentID);
    const userName = Users.getFullName(review.studentID);
    const userUsername = user.username;
    const userPicture = user.picture;
    const reviewSemester = Semesters.toString(review.semesterID);
    const reviewRating = review.rating;
    const reviewComments = review.comments;
    return { name: userName, username: userUsername, picture: userPicture, semester: reviewSemester,
      rating: reviewRating, comments: reviewComments };
  },
  reviews() {
    const event = this.event;
    const matchingReviews = Reviews.find({
      revieweeID: event._id,
      visible: true,
    }).fetch();
    const matchingReviewsFinal = _.filter(matchingReviews, function matchStudentID(review) {
      let ret = true;
      if (review.studentID === getUserIdFromRoute()) {
        ret = false;
      }
      return ret;
    });
    return matchingReviewsFinal;
  },
  usersRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerUsersPageRouteName;
    }
    return RouteNames.mentorExplorerUsersPageRouteName;  },
  userUsername(user) {
    return Users.findDoc(user).username;
  },
});

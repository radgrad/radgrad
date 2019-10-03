import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getGroupName } from '../shared/route-group-name';

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
    if (getUserIdFromRoute()) {
      return Users.getFullName(getUserIdFromRoute());
    }
    return '';
  },
  currentUserPicture() {
    if (getUserIdFromRoute()) {
      return Users.getProfile(getUserIdFromRoute()).picture;
    }
    return '';
  },
  reviewData(review) {
    const profile = Users.getProfile(review.studentID);
    const userName = Users.getFullName(review.studentID);
    const userUsername = profile.username;
    const userPicture = profile.picture;
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
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
  userUsername(user) {
    return user && Users.getProfile(user).username;
  },
});

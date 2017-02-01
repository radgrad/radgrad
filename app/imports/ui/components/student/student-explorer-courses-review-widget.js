import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

Template.Student_Explorer_Courses_Review_Widget.onCreated(function onCreated() {
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Reviews.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

function averageRatingHelper(course) {
  let averageRating = 0;
  let numReviews = 0;
  const matchingReviews = Reviews.find({
    revieweeID: course._id,
  }).fetch();
  numReviews = matchingReviews.length;
  _.map(matchingReviews, (review) => {
    averageRating += review.rating;
  });
  averageRating /= numReviews;
  return Math.floor(averageRating);
}

Template.Student_Explorer_Courses_Review_Widget.helpers({
  reviews() {
    const course = this.course;
    const matchingReviews = Reviews.find({
      revieweeID: course._id,
      visible: true,
    }).fetch();
    return matchingReviews;
  },
  averageRating() {
    return averageRatingHelper(this.course);
  },
  averageStars() {
    const reviewRating = averageRatingHelper(this.course);
    const reviewStars = [];
    for (let i = 0; i < reviewRating; i += 1) {
      reviewStars.push('yellow fitted star icon');
    }
    for (let i = reviewRating; i < 5; i += 1) {
      reviewStars.push('yellow fitted empty star icon');
    }
    return reviewStars;
  },
  reviewData(review) {
    const user = Users.findDoc(review.studentID);
    const userName = Users.getFullName(review.studentID);
    const userPicture = user.picture;
    const reviewSemester = Semesters.toString(review.semesterID);
    const reviewRating = review.rating;
    const reviewStars = [];
    for (let i = 0; i < reviewRating; i += 1) {
      reviewStars.push('yellow fitted star icon');
    }
    for (let i = reviewRating; i < 5; i += 1) {
      reviewStars.push('yellow fitted empty star icon');
    }
    const reviewComments = review.comments;
    return { name: userName, picture: userPicture, semester: reviewSemester,
      rating: review, stars: reviewStars, comments: reviewComments };
  },
  currentUserName() {
    return Users.getFullName(getUserIdFromRoute());
  },
  currentUserPicture() {
    return Users.findDoc(getUserIdFromRoute()).picture;
  },
  abbreviateSemester(semester) {
    var semNameYear = semester.split(" ");
    var semName = "";
    switch (semNameYear[0]) {
      case 'Spring':
        semName = "Spr";
        break;
      case 'Fall':
        semName = "Fall";
        break;
      case 'Summer':
        semName = 'Sum';
        break;
    }
    return semName + " " + semNameYear[1];  
  }
});

Template.Student_Explorer_Courses_Review_Widget.events({

});

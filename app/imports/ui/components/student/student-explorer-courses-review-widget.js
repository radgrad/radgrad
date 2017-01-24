import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

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
      reviewStars.push('yellow fitted large star icon');
    }
    for (let i = reviewRating; i < 5; i += 1) {
      reviewStars.push('yellow fitted large empty star icon');
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
      reviewStars.push('yellow fitted large star icon');
    }
    for (let i = reviewRating; i < 5; i += 1) {
      reviewStars.push('yellow fitted large empty star icon');
    }
    const reviewComments = review.comments;
    return { name: userName, picture: userPicture, semester: reviewSemester,
      rating: review, stars: reviewStars, comments: reviewComments };
  },
});

Template.Student_Explorer_Courses_Review_Widget.events({

});

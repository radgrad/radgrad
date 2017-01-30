import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';


Template.Student_Explorer_Opportunities_Review_Widget.onCreated(function onCreated() {
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Reviews.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

Template.Student_Explorer_Opportunities_Review_Widget.helpers({
  reviews() {
    const opportunity = this.opportunity;
    const matchingReviews = Reviews.find({
      revieweeID: opportunity._id,
      visible: true,
    }).fetch();
    return matchingReviews;
  },
  averageRating(opportunity) {
    let averageRating = 0;
    let numReviews = 0;
    const matchingReviews = Reviews.find({
      revieweeID: opportunity._id,
    }).fetch();
    numReviews = matchingReviews.length;
    _.map(matchingReviews, (review) => {
      averageRating += review.rating;
    })
    ;
    averageRating /= numReviews;
    return Math.floor(averageRating);
  },
  reviewData(review) {
    const user = Users.findDoc(review.studentID);
    const userName = Users.getFullName(review.studentID);
    const userPicture = user.picture;
    const reviewSemester = Semesters.toString(review.semesterID);
    const reviewRating = review.rating;
    const reviewComments = review.comments;
    return { name: userName, picture: userPicture, semester: reviewSemester,
      rating: reviewRating, comments: reviewComments };
  },
  reviewUser(review) {
    let ret = false;
    if (review.studentID === getUserIdFromRoute()) {
      ret = true;
    }
    return ret;
  },
});

Template.Student_Explorer_Opportunities_Review_Widget.events({

});

Template.Student_Explorer_Opportunities_Review_Widget.onRendered(function studentExplorerOpportunitiesReviewWidget() {
  this.$('.ui.accordion').accordion();
  this.$('.ui.rating').rating('disable');
});


import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import { Feed } from '../../../api/feed/FeedCollection';
import { moment } from 'meteor/momentjs:moment';


Template.Review_Moderation.helpers({
  pendingCourseReviews() {
    return Reviews.find({ moderated: false, reviewType: 'course' });
  },
  pendingOpportunityReviews() {
    return Reviews.find({ moderated: false, reviewType: 'opportunity' });
  },
  moderatorComments(review) {
    return review.moderatorComments;
  },
  rating(review) {
    return review.rating;
  },
  revieweeName(review) {
    let reviewee;
    if (review.reviewType === 'course') {
      reviewee = Courses.findDoc(review.revieweeID);
    } else if (review.reviewType === 'opportunity') {
      reviewee = Opportunities.findDoc(review.revieweeID);
    }
    return reviewee.name;
  },
  semester(review) {
    return Semesters.toString(review.semesterID);
  },
  studentName(review) {
    return Users.getFullName(review.studentID);
  },
  studentComments(review) {
    return review.comments;
  },
  whenSubmitted(request) {
    const submitted = moment(request.submittedOn);
    return submitted.calendar();
  },
});

Template.Review_Moderation.events({
  'click button': function clickButton(event) {
    event.preventDefault();
    const split = event.target.id.split('-');
    const reviewID = split[0];
    const review = Reviews.findDoc(reviewID);
    if (split[1] === 'accept') {
      review.moderated = true;
      review.visible = true;
    } else {
      review.moderated = true;
      review.visible = false;
    }
    const moderatorComments = event.target.parentElement.querySelectorAll('textarea')[0].value;
    const moderated = review.moderated;
    const visible = review.visible;
    Reviews.updateModerated(reviewID, moderated, visible, moderatorComments);
  },
});

import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection.js';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';


Template.Review_Moderation.helpers({
  moderatorComments(review) {
    return review.moderatorComments;
  },
  pendingCourseReviews() {
    return Reviews.find({ moderated: false, reviewType: 'course' });
  },
  pendingOpportunityReviews() {
    return Reviews.find({ moderated: false, reviewType: 'opportunity' });
  },
  pendingQuestions() {
    return MentorQuestions.find({ approved: false });
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
});

Template.Review_Moderation.events({
  'click button': function clickButton(event) {
    event.preventDefault();
    const split = event.target.id.split('-');
    const itemID = split[0];
    let item;
    if (split[1] === 'review') {
      item = Reviews.findDoc(itemID);
      if (split[2] === 'accept') {
        item.moderated = true;
        item.visible = true;
      } else {
        item.moderated = true;
        item.visible = false;
      }
      const moderatorComments = event.target.parentElement.querySelectorAll('textarea')[0].value;
      const moderated = review.moderated;
      const visible = review.visible;
      Reviews.updateModerated(itemID, moderated, visible, moderatorComments);
    } else {
      item = MentorQuestions.findDoc(itemID);
      if (split[2] === 'accept') {
        item.approved = true;
      }
      const approved = item.approved;
      MentorQuestions.updateApproved(itemID, approved );
    }
  },
});

Template.Review_Moderation.onCreated(function reviewModerationOnCreated() {
  this.subscribe(MentorQuestions.getPublicationName());
});
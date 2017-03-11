import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection.js';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';


Template.Moderation.helpers({
  moderatorComments(review) {
    return review.moderatorComments;
  },
  noSlug(question) {
    return !question.slugID;
  },
  pendingCourseReviews() {
    return Reviews.find({ moderated: false, reviewType: 'course' });
  },
  pendingOpportunityReviews() {
    return Reviews.find({ moderated: false, reviewType: 'opportunity' });
  },
  pendingQuestions() {
    return MentorQuestions.find({ moderated: false, visible: false });
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

Template.Moderation.events({
  'click button': function clickButton(event) {
    event.preventDefault();
    const split = event.target.id.split('-');
    const itemID = split[0];
    let item;
    if (split[1] === 'review') {
      item = Reviews.findDoc(itemID);
    } else {
      item = MentorQuestions.findDoc(itemID);
    }
    if (split[2] === 'accept') {
      item.moderated = true;
      item.visible = true;
    } else {
      item.moderated = true;
      item.visible = false;
    }
    const moderatorComments = event.target.parentElement.querySelectorAll('textarea')[0].value;
    const moderated = item.moderated;
    const visible = item.visible;
    if (split[1] === 'review') {
      Reviews.updateModerated(itemID, moderated, visible, moderatorComments);
    } else {
      MentorQuestions.updateModerated(itemID, moderated, visible, moderatorComments);
      if (!item.slugiD) {
        const slug = event.target.parentElement.querySelectorAll('input')[0].value;
        MentorQuestions.updateSlug(itemID, slug);
      }
    }
  },
});

Template.Moderation.onCreated(function ModerationOnCreated() {
  this.subscribe(MentorQuestions.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
});

import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/List_Reviews_Widget */

function numReferences() {
  // currently nothing refers to a Teaser, but maybe in future something will.
  return 0;
}

Template.List_Reviews_Widget.helpers({
  reviews() {
    const allReviews = Reviews.find().fetch();
    const sortByReviewee = _.sortBy(allReviews, function (review) {
      if (review.reviewType === 'course') {
        return Courses.getSlug(review.revieweeID);
      } else if (review.reviewType === 'opportunity') {
        return Opportunities.getSlug(review.revieweeID);
      }
      return '';
    });
    return _.sortBy(sortByReviewee, function (review) {
      return Users.getFullName(review.studentID);
    });
  },
  count() {
    return Reviews.count();
  },
  deleteDisabled(opportunity) {
    return (numReferences(opportunity) > 0) ? 'disabled' : '';
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(review) {
    let reviewee;
    if (review.reviewType === 'course') {
      reviewee = Courses.findDoc(review.revieweeID);
    } else if (review.reviewType === 'opportunity') {
      reviewee = Opportunities.findDoc(review.revieweeID);
    }
    return [
      { label: 'Student', value: Users.getFullName(review.studentID) },
      { label: 'Review Type', value: review.reviewType },
      { label: 'Reviewee', value: reviewee.name },
      { label: 'Semester', value: Semesters.toString(review.semesterID) },
      { label: 'Rating', value: review.rating },
      { label: 'Comments', value: review.comments },
      { label: 'Moderated', value: review.moderated.toString() },
      { label: 'Visible', value: review.visible.toString() },
      { label: 'Moderator Comments', value: review.moderatorComments },
    ];
  },
});

Template.List_Reviews_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event) {
    event.preventDefault();
    const id = event.target.value;
    Reviews.removeIt(id);
  },
});

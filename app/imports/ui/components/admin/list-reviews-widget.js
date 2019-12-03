import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';

function numReferences() {
  // currently nothing refers to a Teaser, but maybe in future something will.
  return 0;
}

Template.List_Reviews_Widget.onCreated(function listReviewsOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

Template.List_Reviews_Widget.helpers({
  reviews() {
    const allReviews = Reviews.find().fetch();
    const sortByReviewee = _.sortBy(allReviews, function (review) {
      if (review.reviewType === 'course') {
        return Courses.getSlug(review.revieweeID);
      } if (review.reviewType === 'opportunity') {
        return Opportunities.getSlug(review.revieweeID);
      }
      return '';
    });
    const items = _.sortBy(sortByReviewee, function (review) {
      return Users.getFullName(review.studentID);
    });
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    return _.slice(items, startIndex, endIndex);
  },
  count() {
    return Reviews.count();
  },
  deleteDisabled(opportunity) {
    return (numReferences(opportunity) > 0) ? 'disabled' : '';
  },
  slugName(slugID) {
    return slugID && Slugs.hasSlug(slugID) && Slugs.findDoc(slugID).name;
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
      { label: 'Retired', value: review.retired ? 'True' : 'False' },
    ];
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return Reviews;
  },
  retired(item) {
    return item.retired;
  },
});

Template.List_Reviews_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'ReviewCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});

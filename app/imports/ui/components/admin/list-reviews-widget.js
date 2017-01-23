import { Template } from 'meteor/templating';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Interests } from '../../../api/interest/InterestCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Users } from '../../../api/user/UserCollection';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as FormUtils from './form-fields/form-field-utilities.js';

Template.List_Reviews_Widget.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(OpportunityTypes.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Reviews.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

function numReferences() {
  // currently nothing refers to a Teaser, but maybe in future something will.
  return 0;
}

Template.List_Reviews_Widget.helpers({
  reviews() {
    return Reviews.find().fetch();
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

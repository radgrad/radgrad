import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Courses } from '../../../api/course/CourseCollection.js';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';

const noSlugSchema = new SimpleSchema({
  moderatorComments: { type: String, optional: true },
});

const withSlugSchema = new SimpleSchema({
  moderatorComments: { type: String, optional: true },
  slug: { type: String, optional: true, custom: FormUtils.slugFieldValidator },
});

Template.Moderation.onCreated(function ModerationOnCreated() {
  FormUtils.setupFormWidget(this, noSlugSchema);
  FormUtils.setupFormWidget(this, withSlugSchema);
});

/**
 * Return the data from the submitted form corresponding to the fields in the passed schema.
 * @param schema The simple schema.
 * @param event The event holding the form data.
 * @returns {Object} An object whose keys are the schema keys and whose values are the corresponding form values.
 */

function getSchemaDataFromEvent(schema, event) {
  const eventData = {};
  _.map(schema._firstLevelSchemaKeys, function (key) {
    eventData[key] = event.target.form[key].value;
  });
  return eventData;
}

Template.Moderation.helpers({
  noSlug(question) {
    return !question.slugID;
  },
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
  slug(question) {
    if (question.slugID) {
      return Slugs.findDoc(question.slugID).name;
    }
    return '';
  },
  studentName(review) {
    return Users.getFullName(review.studentID);
  },
  studentComments(review) {
    return review.comments;
  },
});

Template.Moderation.events({
  'click button': function clickButton(event, instance) {
    event.preventDefault();
    const split = event.target.id.split('-');
    const itemID = split[0];
    let newData;
    let item;
    if (split[1] === 'review') {
      newData = getSchemaDataFromEvent(noSlugSchema, event);
      instance.context.resetValidation();
      noSlugSchema.clean(newData);
    } else if (split[3]) {
      newData = getSchemaDataFromEvent(withSlugSchema, event);
      instance.context.resetValidation();
      withSlugSchema.clean(newData);
    } else {
      newData = getSchemaDataFromEvent(noSlugSchema, event);
      instance.context.resetValidation();
      noSlugSchema.clean(newData);
    }
    instance.context.validate(newData);
    if (instance.context.isValid()) {
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
      const moderatorComments = newData.moderatorComments;
      const moderated = item.moderated;
      const visible = item.visible;
      if (split[1] === 'review') {
        Reviews.updateModerated(itemID, moderated, visible, moderatorComments);
      } else {
        MentorQuestions.updateModerated(itemID, moderated, visible, moderatorComments);
        if (!item.slugID) {
          const slug = newData.slug;
          MentorQuestions.updateSlug(itemID, slug);
        }
      }
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { reviewRatingsObjects } from '../shared/review-ratings.js';
import * as FormUtils from '../form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  // student: String,
  // reviewType: String,
  // reviewee: String,
  semester: String,
  rating: { type: Number, min: 0, max: 5 },
  comments: String,
  moderated: { type: String, optional: true },
  visible: { type: String, optional: true },
  moderatorComments: { type: String, optional: true },
}, { tracker: Tracker });

Template.Update_Review_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Review_Widget.helpers({
  semesters() {
    return Semesters.findNonRetired({}, { sort: { semesterNumber: 1 } });
  },
  students() {
    return Users.findProfiles();
  },
  reviewTypes() {
    return ['course', 'opportunity'];
  },
  ratings() {
    return reviewRatingsObjects;
  },
  slug() {
    const review = Reviews.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(review.slugID).name;
  },
  student() {
    const review = Reviews.findDoc(Template.currentData().updateID.get());
    return Users.getProfile(review.studentID).username;
  },
  review() {
    return Reviews.findDoc(Template.currentData().updateID.get());
  },
  reviewee() {
    const review = Reviews.findDoc(Template.currentData().updateID.get());
    let reviewee;
    if (review.reviewType === 'course') {
      reviewee = Slugs.findDoc(Courses.findDoc(review.revieweeID).slugID).name;
    } else if (review.reviewType === 'opportunity') {
      reviewee = Slugs.findDoc(Opportunities.findDoc(review.revieweeID).slugID).name;
    }
    return reviewee;
  },
  semester() {
    const review = Reviews.findDoc(Template.currentData().updateID.get());
    return Semesters.findDoc(review.semesterID);
  },
  trueValue(type) {
    const review = Reviews.findDoc(Template.currentData().updateID.get());
    let trueValue;
    if (type === 'moderated') {
      trueValue = review.moderated;
    } else if (type === 'visible') {
      trueValue = review.visible;
    }
    return trueValue;
  },
  falseValue(type) {
    const review = Reviews.findDoc(Template.currentData().updateID.get());
    let falseValue;
    if (type === 'moderated') {
      falseValue = !(review.moderated);
    } else if (type === 'visible') {
      falseValue = !(review.visible);
    }
    return falseValue;
  },
});

Template.Update_Review_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    updateData.moderated = (updateData.moderated === 'true');
    updateData.visible = (updateData.visible === 'true');
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: 'ReviewCollection', updateData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});

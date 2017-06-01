import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { reviewsUpdateMethod } from '../../../api/review/ReviewCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { reviewRatingsObjects } from '../shared/review-ratings.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Update_Review_Widget */

const updateSchema = new SimpleSchema({
  student: { type: String, optional: false },
  reviewType: { type: String, optional: false },
  reviewee: { type: String, optional: false },
  semester: { type: String, optional: false },
  rating: { type: Number, optional: false, min: 0, max: 5 },
  comments: { type: String, optional: false },
  moderated: { type: String, optional: true },
  visible: { type: String, optional: true },
  moderatorComments: { type: String, optional: true },
});

Template.Update_Review_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Review_Widget.helpers({
  semesters() {
    return Semesters.find({});
  },
  students() {
    return Users.find({});
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
    return Slugs.findDoc(Users.findDoc(review.studentID).slugID).name;
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
    const updatedData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.resetValidation();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    updatedData.moderated = (updatedData.moderated === 'true');
    updatedData.visible = (updatedData.visible === 'true');
    FormUtils.renameKey(updatedData, 'semester', 'semesterID');
    FormUtils.renameKey(updatedData, 'student', 'studentID');
    console.log(updatedData);
    if (instance.context.isValid()) {
      updatedData.id = instance.data.updateID.get();
      reviewsUpdateMethod.call(updatedData, (error) => {
        if (error) {
          console.log('Error defining Review', error);
          FormUtils.indicateError(instance);
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

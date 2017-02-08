import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

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
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
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
    return [{ score: 1, description: '1 (In general, this is one of the worst ICS ' +
    'courses/opportunities I have ever taken)' },
      { score: 2, description: '2 (In general, this is below average for an ICS course/opportunity)' },
      { score: 3, description: '3 (In general, this is an average ICS course/opportunity)' },
      { score: 4, description: '4 (In general, this is above average for an ICS course/opportunity)' },
      { score: 5, description: '5 (In general, this is one of the best ICS courses/opportunities I have ever taken)' }];
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
    if (instance.context.isValid()) {
      Reviews.update(instance.data.updateID.get(), { $set: updatedData });
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});

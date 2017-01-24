import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';

const editSchema = new SimpleSchema({
  semester: { type: String, optional: false, minCount: 1 },
  rating: { type: Number, optional: true },
  comments: { type: String, optional: false },
});

Template.Student_Explorer_Courses_Edit_Review_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, editSchema);
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
});

Template.Student_Explorer_Courses_Edit_Review_Widget.helpers({
  ratings() {
    return [{ score: 1, description: '1 (In general, this is one of the worst ICS ' +
    'courses I have ever taken)' },
      { score: 2, description: '2 (In general, this is below average for an ICS course)' },
      { score: 3, description: '3 (In general, this is an average ICS course)' },
      { score: 4, description: '4 (In general, this is above average for an ICS course)' },
      { score: 5, description: '5 (In general, this is one of the best ICS courses I have ever taken)' }];
  },
  semesters() {
    const semesters = [];
    const course = this.course;
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    _.map(ci, (c) => {
      semesters.push(Semesters.findDoc(c.semesterID));
    });
    return semesters;
  },
});

Template.Student_Explorer_Courses_Edit_Review_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updatedData = FormUtils.getSchemaDataFromEvent(editSchema, event);
    instance.context.resetValidation();
    editSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      updatedData.student = this.review.student;
      updatedData.reviewType = this.review.reviewType;
      updatedData.reviewee = this.review.reviewee;
      updatedData.slug = this.review.slug;
      Reviews.update(this.review._id, { $set: updatedData });
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});

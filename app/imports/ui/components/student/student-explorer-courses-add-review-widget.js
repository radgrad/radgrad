import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Courses } from '../../../api/course/CourseCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';

const addSchema = new SimpleSchema({
  semester: { type: String, optional: false, minCount: 1 },
  rating: { type: Number, optional: true },
  comments: { type: String, optional: false },
});

Template.Student_Explorer_Courses_Add_Review_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
});

Template.Student_Explorer_Courses_Add_Review_Widget.helpers({
  ratings() {
    return [{ score: 1, description: '1 (In general, this is one of the worst ICS ' +
    'courses/opportunities I have ever taken)' },
      { score: 2, description: '2 (In general, this is below average for an ICS course/opportunity)' },
      { score: 3, description: '3 (In general, this is an average ICS course/opportunity)' },
      { score: 4, description: '4 (In general, this is above average for an ICS course/opportunity)' },
      { score: 5, description: '5 (In general, this is one of the best ICS courses/opportunities I have ever taken)' }];
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

Template.Student_Explorer_Courses_Add_Review_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.resetValidation();
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      newData.student = getRouteUserName();
      console.log(newData.slug);
      newData.reviewType = 'course';
      newData.reviewee = this.course._id;
      newData.slug = `review-course-${Courses.getSlug(newData.reviewee)}-${newData.student}`;
      Reviews.define(newData);
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

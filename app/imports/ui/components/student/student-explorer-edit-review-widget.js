import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';

const editSchema = new SimpleSchema({
  semester: { type: String, optional: false },
  rating: { type: Number, optional: true },
  comments: { type: String, optional: false },
});

Template.Student_Explorer_Edit_Review_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, editSchema);
});

Template.Student_Explorer_Edit_Review_Widget.helpers({
  ratings() {
    return [{ score: 1, description: '(In general, this is one of the worst ICS ' +
    'courses/opportunities I have ever participated in)' },
      { score: 2, description: '(In general, this is below average for an ICS course/opportunity)' },
      { score: 3, description: '(In general, this is an average ICS course/opportunity)' },
      { score: 4, description: '(In general, this is above average for an ICS course/opportunity)' },
    { score: 5, description: '(In general, this is one of the best ICS courses/opportunities ' +
      'I have ever participated in)' }];
  },
  semesters() {
    const semesters = [];
    let instances;
    if (this.review.reviewType === 'course') {
      const course = this.event;
      instances = CourseInstances.find({
        studentID: getUserIdFromRoute(),
        courseID: course._id,
      }).fetch();
    } else {
      const opportunity = this.event;
      instances = OpportunityInstances.find({
        studentID: getUserIdFromRoute(),
        opportunityID: opportunity._id,
      }).fetch();
    }
    _.map(instances, function (instance) {
      semesters.push(Semesters.findDoc(instance.semesterID));
    });
    return semesters;
  },
});

Template.Student_Explorer_Edit_Review_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updatedData = FormUtils.getSchemaDataFromEvent(editSchema, event);
    instance.context.resetValidation();
    editSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      updatedData.moderated = false;
      FormUtils.renameKey(updatedData, 'semester', 'semesterID');
      Reviews.update(this.review._id, { $set: updatedData });
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsDelete': function (event) {
    event.preventDefault();
    const id = event.target.value;
    Reviews.removeIt(id);
  },
});

Template.Student_Explorer_Edit_Review_Widget.onRendered(function studentExplorerEditReviewWidget() {
  this.$('.ui.accordion').accordion();
});

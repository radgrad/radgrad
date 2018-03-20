import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { updateMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { reviewRatingsObjects } from '../shared/review-ratings';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';

const editSchema = new SimpleSchema({
  semester: String,
  rating: { type: Number, optional: true },
  comments: String,
});

Template.Student_Explorer_Edit_Review_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, editSchema);
});

Template.Student_Explorer_Edit_Review_Widget.helpers({
  ratings() {
    return reviewRatingsObjects;
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
    _.forEach(instances, function (instance) {
      const semester = Semesters.findDoc(instance.semesterID);
      if (semester.semesterNumber <= Semesters.getCurrentSemesterDoc().semesterNumber) {
        semesters.push(Semesters.findDoc(instance.semesterID));
      }
    });
    return semesters;
  },
});

Template.Student_Explorer_Edit_Review_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(editSchema, event);
    instance.context.reset();
    editSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.moderated = false;
      FormUtils.renameKey(updateData, 'semester', 'semesterID');
      updateData.id = this.review._id;
      const collectionName = Reviews.getCollectionName();
      updateMethod.call({ collectionName, updateData }, (error) => {
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
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    const collectionName = Reviews.getCollectionName();
    removeItMethod.call({ collectionName, instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});

Template.Student_Explorer_Edit_Review_Widget.onRendered(function studentExplorerEditReviewWidget() {
  this.$('.ui.accordion').accordion();
});

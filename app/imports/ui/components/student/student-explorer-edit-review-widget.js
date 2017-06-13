import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { Feeds } from '../../../api/feed/FeedCollection';
import { feedsRemoveItMethod } from '../../../api/feed/FeedCollection.methods';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import {
  reviewsUpdateMethod,
  reviewsRemoveItMethod,
} from '../../../api/review/ReviewCollection.methods';
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
    _.map(instances, function (instance) {
      const semester = Semesters.findDoc(instance.semesterID);
      if (semester.semesterNumber < Semesters.getCurrentSemesterDoc().semesterNumber) {
        semesters.push(Semesters.findDoc(instance.semesterID));
      }
    });
    return semesters;
  },
});

Template.Student_Explorer_Edit_Review_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updatedData = FormUtils.getSchemaDataFromEvent(editSchema, event);
    instance.context.reset();
    editSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      updatedData.moderated = false;
      FormUtils.renameKey(updatedData, 'semester', 'semesterID');
      updatedData.id = this.review._id;
      reviewsUpdateMethod.call(updatedData, (error) => {
        if (error) {
          console.log('Error defining Review', error);
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
    reviewsRemoveItMethod.call({ id }, (error) => {
      if (error) {
        console.log('Error defining Review', error);
        FormUtils.indicateError(instance, error);
      } else {
        FormUtils.indicateSuccess(instance, event);
        let feeds = Feeds.find({ opportunityID: id }).fetch();
        _.forEach(feeds, (f) => {
          feedsRemoveItMethod.call({ id: f._id }, (err) => {
            if (err) {
              console.log('Error removing Feed', err);
            }
          });
        });
        feeds = Feeds.find({ courseID: id }).fetch();
        _.forEach(feeds, (f) => {
          feedsRemoveItMethod.call({ id: f._id }, (err) => {
            if (err) {
              console.log('Error removing Feed', err);
            }
          });
        });
      }
    });
  },
});

Template.Student_Explorer_Edit_Review_Widget.onRendered(function studentExplorerEditReviewWidget() {
  this.$('.ui.accordion').accordion();
});

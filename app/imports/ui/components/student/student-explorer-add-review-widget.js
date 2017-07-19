import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Feeds } from '../../../api/feed/FeedCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { reviewRatingsObjects } from '../shared/review-ratings';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';
import { appLog } from '../../../api/log/AppLogCollection';

const addSchema = new SimpleSchema({
  semester: String,
  rating: { type: Number, optional: true },
  comments: String,
});

Template.Student_Explorer_Add_Review_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Student_Explorer_Add_Review_Widget.helpers({
  ratings() {
    return reviewRatingsObjects;
  },
  semesters() {
    const semesters = [];
    let instances;
    if (this.reviewType === 'course') {
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
    _.forEach(instances, (instance) => {
      const semester = Semesters.findDoc(instance.semesterID);
      if (semester.semesterNumber < Semesters.getCurrentSemesterDoc().semesterNumber) {
        semesters.push(Semesters.findDoc(instance.semesterID));
      }
    });
    return semesters;
  },
});

Template.Student_Explorer_Add_Review_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      newData.student = getRouteUserName();
      newData.reviewType = this.reviewType;
      newData.reviewee = this.event._id;
      defineMethod.call({ collectionName: 'ReviewCollection', definitionData: newData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
      let feedData;
      if (this.reviewType === 'course') {
        feedData = { feedType: Feeds.NEW_COURSE_REVIEW, user: newData.student, course: newData.reviewee };
        const message = `${getRouteUserName()} added a course review for ${newData.reviewee}.`;
        appLog.info(message);
      }
      if (this.reviewType === 'opportunity') {
        feedData = { feedType: Feeds.NEW_OPPORTUNITY_REVIEW, user: newData.student, opportunity: newData.reviewee };
        const message = `${getRouteUserName()} added an opportunity review for ${newData.reviewee}.`;
        appLog.info(message);
      }
      defineMethod.call({ collectionName: Feeds.getCollectionName(), definitionData: feedData });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

Template.Student_Explorer_Add_Review_Widget.onRendered(function studentExplorerAddReviewWidget() {
  this.$('.ui.accordion').accordion();
});

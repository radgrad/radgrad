import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { Feeds } from '../../../api/feed/FeedCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Reviews } from '../../../api/review/ReviewCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';

const addSchema = new SimpleSchema({
  semester: { type: String, optional: false },
  rating: { type: Number, optional: true },
  comments: { type: String, optional: false },
});

Template.Student_Explorer_Add_Review_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Student_Explorer_Add_Review_Widget.helpers({
  ratings() {
    return [{ score: 1, description: '(In general, this is one of the worst ICS ' +
    'courses/opportunities I have ever partcipiated in)' },
      { score: 2, description: '(In general, this is below average for an ICS course/opportunity)' },
      { score: 3, description: '(In general, this is an average ICS course/opportunity)' },
      { score: 4, description: '(In general, this is above average for an ICS course/opportunity)' },
    { score: 5, description: '(In general, this is one of the best ICS courses/opportunities ' +
      'I have ever participated in)' }];
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
    _.map(instances, (instance) => {
      semesters.push(Semesters.findDoc(instance.semesterID));
    });
    return semesters;
  },
});

Template.Student_Explorer_Add_Review_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.resetValidation();
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      newData.student = getRouteUserName();
      newData.reviewType = this.reviewType;
      newData.reviewee = this.event._id;
      Reviews.define(newData);
      FormUtils.indicateSuccess(instance, event);
      let feedDefinition;
      if (this.reviewType === 'course') {
        feedDefinition = {
          user: [newData.student],
          course: newData.reviewee,
          feedType: 'new-course-review',
          timestamp: Date.now(),
        };
      } else {
        feedDefinition = {
          user: [newData.student],
          opportunity: newData.reviewee,
          feedType: 'new-opportunity-review',
          timestamp: Date.now(),
        };
      }
      Feeds.define(feedDefinition);
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

Template.Student_Explorer_Add_Review_Widget.onRendered(function studentExplorerAddReviewWidget() {
  this.$('.ui.accordion').accordion();
});

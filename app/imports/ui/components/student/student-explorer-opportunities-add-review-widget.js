import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
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

Template.Student_Explorer_Opportunities_Add_Review_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
});

Template.Student_Explorer_Opportunities_Add_Review_Widget.helpers({
  ratings() {
    return [{ score: 1, description: '1 (In general, this is one of the worst ICS ' +
    'opportunity I have ever partcipiated in)' },
      { score: 2, description: '2 (In general, this is below average for an ICS opportunity)' },
      { score: 3, description: '3 (In general, this is an average ICS opportunity)' },
      { score: 4, description: '4 (In general, this is above average for an ICS opportunity)' },
    { score: 5, description: '5 (In general, this is one of the best ICS opportunities ' +
      'I have ever participated in)' }];
  },
  semesters() {
    const semesters = [];
    const opportunity = this.opportunity;
    const ci = OpportunityInstances.find({
      studentID: getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    _.map(ci, (c) => {
      semesters.push(Semesters.findDoc(c.semesterID));
    });
    return semesters;
  },
});

Template.Student_Explorer_Opportunities_Add_Review_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.resetValidation();
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      newData.student = getRouteUserName();
      newData.reviewType = 'opportunity';
      newData.reviewee = this.opportunity._id;
      newData.slug = `review-opportunity-${newData.reviewee}-${newData.student}`;
      Reviews.define(newData);
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

Template.Student_Explorer_Opportunities_Add_Review_Widget.onRendered(
  function studentExplorerOpportunitiesAddReviewWidget() {
    this.$('.ui.accordion').accordion();
  }
);

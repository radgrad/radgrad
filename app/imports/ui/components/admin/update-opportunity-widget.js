import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  name: { type: String, optional: false },
  eventDate: { type: Date, optional: true },
  description: { type: String, optional: false },
  opportunityType: { type: String, optional: false },
  sponsor: { type: String, optional: false },
  innovation: { type: Number, optional: false, min: 0, max: 100 },
  competency: { type: Number, optional: false, min: 0, max: 100 },
  experience: { type: Number, optional: false, min: 0, max: 100 },
  interests: { type: [String], optional: false, minCount: 1 },
  semesters: { type: [String], optional: false, minCount: 1 },
  moreInformation: { type: String, optional: false },
  icon: { type: String, optional: true },
});

Template.Update_Opportunity_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
  this.subscribe(Interests.getPublicationName());
  this.subscribe(OpportunityTypes.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
});

Template.Update_Opportunity_Widget.helpers({
  opportunityTypes() {
    return OpportunityTypes.find({}, { sort: { name: 1 } });
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  semesters() {
    return Semesters.find({});
  },
  sponsors() {
    return Roles.getUsersInRole([ROLE.FACULTY, ROLE.ADMIN, ROLE.ADVISOR]);
  },
  slug() {
    const opportunity = Opportunities.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(opportunity.slugID).name;
  },
  opportunity() {
    return Opportunities.findDoc(Template.currentData().updateID.get());
  },
  selectedInterestIDs() {
    const opportunity = Opportunities.findDoc(Template.currentData().updateID.get());
    return opportunity.interestIDs;
  },
  selectedSemesterIDs() {
    const opportunity = Opportunities.findDoc(Template.currentData().updateID.get());
    return opportunity.semesterIDs;
  },
});

Template.Update_Opportunity_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updatedData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.resetValidation();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      FormUtils.convertICE(updatedData);
      FormUtils.renameKey(updatedData, 'interests', 'interestIDs');
      FormUtils.renameKey(updatedData, 'semesters', 'semesterIDs');
      Opportunities.update(instance.data.updateID.get(), { $set: updatedData });
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});

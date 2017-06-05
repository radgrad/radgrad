import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { opportunitiesUpdateMethod } from '../../../api/opportunity/OpportunityCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Update_Opportunity_Widget */

const updateSchema = new SimpleSchema({
  name: { type: String, optional: false },
  slug: { type: String },
  eventDate: { type: Date, optional: true },
  description: { type: String, optional: false },
  opportunityType: { type: String, optional: false },
  sponsor: { type: String, optional: false },
  innovation: { type: Number, optional: false, min: 0, max: 100 },
  competency: { type: Number, optional: false, min: 0, max: 100 },
  experience: { type: Number, optional: false, min: 0, max: 100 },
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  semesters: { type: Array, minCount: 1 }, 'semesters.$': String,
  icon: { type: String, optional: true },
});

Template.Update_Opportunity_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
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
    instance.context.reset();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      FormUtils.convertICE(updatedData);
      FormUtils.renameKey(updatedData, 'slug', 'slugID');
      FormUtils.renameKey(updatedData, 'interests', 'interestIDs');
      FormUtils.renameKey(updatedData, 'semesters', 'semesterIDs');
      FormUtils.renameKey(updatedData, 'opportunityType', 'opportunityTypeID');
      FormUtils.renameKey(updatedData, 'sponsor', 'sponsorID');
      updatedData.independentStudy = false;
      updatedData.id = instance.data.updateID.get();
      opportunitiesUpdateMethod.call(updatedData, (error) => {
        if (error) {
          console.log('Error updating Opportunity', error);
          FormUtils.indicateError(instance);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});

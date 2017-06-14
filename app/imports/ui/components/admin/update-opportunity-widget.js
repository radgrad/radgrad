import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
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
  name: String,
  eventDate: { type: Date, optional: true },
  description: String,
  opportunityType: String,
  sponsor: String,
  innovation: { type: Number, min: 0, max: 100 },
  competency: { type: Number, min: 0, max: 100 },
  experience: { type: Number, min: 0, max: 100 },
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  semesters: { type: Array, minCount: 1 }, 'semesters.$': String,
  icon: { type: String, optional: true },
}, { tracker: Tracker });

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
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      FormUtils.convertICE(updateData);
      FormUtils.renameKey(updateData, 'slug', 'slugID');
      FormUtils.renameKey(updateData, 'interests', 'interestIDs');
      FormUtils.renameKey(updateData, 'semesters', 'semesterIDs');
      FormUtils.renameKey(updateData, 'opportunityType', 'opportunityTypeID');
      FormUtils.renameKey(updateData, 'sponsor', 'sponsorID');
      updateData.independentStudy = false;
      updateData.id = instance.data.updateID.get();
      opportunitiesUpdateMethod.call(updateData, (error) => {
        if (error) {
          console.log('Error updating Opportunity', error);
          FormUtils.indicateError(instance, error);
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

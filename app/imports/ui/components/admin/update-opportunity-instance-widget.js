import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import * as FormUtils from '../form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  semester: String,
  opportunity: String,
  verified: String,
  user: String,
  innovation: { type: Number, min: 0, max: 100 },
  competency: { type: Number, min: 0, max: 100 },
  experience: { type: Number, min: 0, max: 100 },
}, { tracker: Tracker });

Template.Update_Opportunity_Instance_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Opportunity_Instance_Widget.helpers({
  semesters() {
    return Semesters.findNonRetired({}, { sort: { semesterNumber: 1 } });
  },
  students() {
    const students = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(students, 'lastName');
    return sorted;
  },
  opportunityInstance() {
    const oi = OpportunityInstances.findDoc(Template.currentData().updateID.get());
    return oi;
  },
  selectedSemesterID() {
    const opportunity = OpportunityInstances.findDoc(Template.currentData().updateID.get());
    return opportunity.semesterID;
  },
  trueValue() {
    const opportunity = OpportunityInstances.findDoc(Template.currentData().updateID.get());
    return opportunity.verified;
  },
  falseValue() {
    const opportunity = OpportunityInstances.findDoc(Template.currentData().updateID.get());
    return !opportunity.verified;
  },
  opportunities() {
    return Opportunities.find({}, { sort: { name: 1 } });
  },
  opportunity() {
    const opportunity = OpportunityInstances.findDoc(Template.currentData().updateID.get());
    return opportunity.opportunityID;
  },
});

Template.Update_Opportunity_Instance_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      FormUtils.convertICE(updateData);
      updateData.verified = (updateData.verified === 'true');
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: 'OpportunityInstanceCollection', updateData }, (error) => {
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
  'click .jsCancel': FormUtils.processCancelButtonClick,
});

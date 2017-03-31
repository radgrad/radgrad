import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  semester: { type: String, optional: false },
  opportunity: { type: String, optional: false },
  verified: { type: String, optional: false },
  user: { type: String, optional: false },
  innovation: { type: Number, optional: false, min: 0, max: 100 },
  competency: { type: Number, optional: false, min: 0, max: 100 },
  experience: { type: Number, optional: false, min: 0, max: 100 },
});

Template.Update_Opportunity_Instance_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Opportunity_Instance_Widget.helpers({
  semesters() {
    return Semesters.find({});
  },
  students() {
    const students = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(students, 'lastName');
    return sorted;  },
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
    const updatedData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.resetValidation();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      FormUtils.convertICE(updatedData);
      updatedData.verified = (updatedData.verified === 'true');
      FormUtils.renameKey(updatedData, 'semester', 'semesterID');
      FormUtils.renameKey(updatedData, 'opportunity', 'opportunityID');
      FormUtils.renameKey(updatedData, 'user', 'studentID');
      OpportunityInstances.update(instance.data.updateID.get(), { $set: updatedData });
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});

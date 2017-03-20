import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

const addSchema = new SimpleSchema({
  semester: { type: String, optional: false },
  opportunity: { type: String, optional: false },
  verified: { type: String, optional: false },
  user: { type: String, optional: false },
  innovation: { type: Number, optional: false, min: 0, max: 100 },
  competency: { type: Number, optional: false, min: 0, max: 100 },
  experience: { type: Number, optional: false, min: 0, max: 100 },
});


Template.Add_Opportunity_Instance_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Opportunity_Instance_Widget.helpers({
  semesters() {
    return Semesters.find({});
  },
  students() {
    return Roles.getUsersInRole([ROLE.STUDENT]);
  },
  opportunities() {
    return Opportunities.find().fetch();
  },
});

Template.Add_Opportunity_Instance_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.resetValidation();
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      newData.verified = (newData.verified === 'true');
      FormUtils.renameKey(newData, 'user', 'student');
      FormUtils.convertICE(newData);
      OpportunityInstances.define(newData);
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { opportunityInstancesDefineMethod } from '../../../api/opportunity/OpportunityInstanceCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Add_Opportunity_Instance_Widget */

const addSchema = new SimpleSchema({
  semester: String,
  opportunity: String,
  verified: String,
  user: String,
  innovation: { type: Number, optional: true, min: 0, max: 100 },
  competency: { type: Number, optional: true, min: 0, max: 100 },
  experience: { type: Number, optional: true, min: 0, max: 100 },
}, { tracker: Tracker });


Template.Add_Opportunity_Instance_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Opportunity_Instance_Widget.helpers({
  semesters() {
    return Semesters.find({});
  },
  students() {
    const students = Roles.getUsersInRole([ROLE.STUDENT]).fetch();
    const sorted = _.sortBy(students, 'lastName');
    return sorted;
  },
  opportunities() {
    return Opportunities.find({}, { sort: { name: 1 } });
  },
});

Template.Add_Opportunity_Instance_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid() &&
        !OpportunityInstances.isOpportunityInstance(newData.semester, newData.opportunity, newData.user)) {
      newData.verified = (newData.verified === 'true');
      FormUtils.renameKey(newData, 'user', 'student');
      FormUtils.convertICE(newData);
      opportunityInstancesDefineMethod.call(newData, (error) => {
        if (error) {
          FormUtils.indicateError(instance);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

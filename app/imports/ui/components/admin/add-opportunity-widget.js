import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role.js';
import { feedsDefineNewOpportunityMethod } from '../../../api/feed/FeedCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection.js';
import { opportunitiesDefineMethod } from '../../../api/opportunity/OpportunityCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

// /** @module ui/components/admin/Add_Opportunity_Widget */

const addSchema = new SimpleSchema({
  name: { type: String, optional: false },
  slug: { type: String, optional: false, custom: FormUtils.slugFieldValidator },
  eventDate: { type: Date, optional: true },
  description: { type: String, optional: false },
  opportunityType: { type: String, optional: false },
  sponsor: { type: String, optional: false },
  innovation: { type: Number, optional: false, min: 0, max: 100 },
  competency: { type: Number, optional: false, min: 0, max: 100 },
  experience: { type: Number, optional: false, min: 0, max: 100 },
  interests: { type: [String], optional: false, minCount: 1 },
  semesters: { type: [String], optional: false, minCount: 1 },
  icon: { type: String, optional: true },
});

Template.Add_Opportunity_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Opportunity_Widget.helpers({
  opportunityTypes() {
    return OpportunityTypes.find({}, { sort: { name: 1 } });
  },
  faculty() {
    const group = FlowRouter.current().route.group.name;
    return group === 'faculty';
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  semesters() {
    return Semesters.find({});
  },
  sponsor() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'faculty') {
      return getUserIdFromRoute();
    }
    return '';
  },
  sponsors() {
    return Roles.getUsersInRole([ROLE.FACULTY, ROLE.ADMIN, ROLE.ADVISOR]);
  },
});

Template.Add_Opportunity_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.resetValidation();
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      FormUtils.convertICE(newData);
      opportunitiesDefineMethod.call(newData, (error) => {
        if (error) {
          FormUtils.indicateError(instance);
        } else {
          FormUtils.indicateSuccess(instance, event);
          const feedDefinition = {
            opportunity: newData.slug,
            feedType: 'new-opportunity',
          };
          feedsDefineNewOpportunityMethod.call(feedDefinition);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

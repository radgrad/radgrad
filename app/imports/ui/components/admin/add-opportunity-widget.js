import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
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
  name: String,
  slug: { type: String, custom: FormUtils.slugFieldValidator },
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
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      FormUtils.convertICE(newData);
      opportunitiesDefineMethod.call(newData, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
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

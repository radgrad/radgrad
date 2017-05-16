import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Add_Teaser_Widget */

const addSchema = new SimpleSchema({
  title: { type: String, optional: false },
  slug: { type: String, optional: false, custom: FormUtils.slugFieldValidator },
  author: { type: String, optional: false },
  url: { type: String, optional: false },
  description: { type: String, optional: false },
  duration: { type: String, optional: false },
  interests: { type: [String], optional: false, minCount: 1 },
});

Template.Add_Teaser_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Teaser_Widget.helpers({
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  opportunities() {
    const opportunities = Opportunities.find().fetch();
    opportunities.push('None');
    return opportunities;
  },
});

Template.Add_Teaser_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.resetValidation();
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      Teasers.define(newData);
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

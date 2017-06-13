import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { teasersDefineMethod } from '../../../api/teaser/TeaserCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Add_Teaser_Widget */

const addSchema = new SimpleSchema({
  title: String,
  slug: { type: String, optional: false, custom: FormUtils.slugFieldValidator },
  author: String,
  url: String,
  description: String,
  duration: String,
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
}, { tracker: Tracker });

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
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      teasersDefineMethod.call(newData, (error) => {
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
});

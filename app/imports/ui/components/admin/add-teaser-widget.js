import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';

import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { Slugs } from '../../../api/slug/SlugCollection';

const addSchema = new SimpleSchema({
  title: String,
  slug: { type: String, custom: FormUtils.slugFieldValidator },
  author: String,
  url: String,
  description: String,
  targetSlug: String,
  duration: { type: String, optional: true },
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
    return Opportunities.findNonRetired({}, { sort: { name: 1 } });
  },
  slugs() {
    return Slugs.findNonRetired({}, { sort: { name: 1 } });
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
      defineMethod.call({ collectionName: 'TeaserCollection', definitionData: newData }, (error) => {
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

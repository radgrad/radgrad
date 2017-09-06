import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { newSlugValidator } from '../../../api/slug/SlugCollection.validators';
import * as FormUtils from './form-fields/form-field-utilities.js';

const addSchema = new SimpleSchema({
  name: String,
  slug: { type: String, custom: newSlugValidator },
  description: String,
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
}, { tracker: Tracker });

Template.Add_Career_Goal_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Career_Goal_Widget.helpers({
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
});

Template.Add_Career_Goal_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      defineMethod.call({ collectionName: 'CareerGoalCollection', definitionData: newData }, (error) => {
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

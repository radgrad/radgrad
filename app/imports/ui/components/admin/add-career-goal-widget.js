import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Add_Career_Goal_Widget */

const addSchema = new SimpleSchema({
  name: { type: String, optional: false },
  slug: { type: String, optional: false, custom: FormUtils.slugFieldValidator },
  description: { type: String, optional: false },
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
});

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
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      defineMethod.call({ collectionName: 'CareerGoalCollection', definition: newData }, (error, result) => {
        if (error) {
          console.log('Error defining CareerGoal: ', error);
          FormUtils.indicateError(instance);  // TODO have a way of setting the FormUtils error text.
        }
        if (result) {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

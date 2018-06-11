import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import * as FormUtils from '../form-fields/form-field-utilities.js';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

const addSchema = new SimpleSchema({
  name: String,
  slug: { type: String, custom: FormUtils.slugFieldValidator },
  shortName: { type: String, optional: true },
  description: String,
}, { tracker: Tracker });

Template.Add_Course_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Course_Widget.helpers({
});

Template.Add_Course_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData, { mutate: true });
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      defineMethod.call({ collectionName: DesiredDegrees.getCollectionName(), definitionData: newData }, (error) => {
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

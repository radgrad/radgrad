import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

/** @module ui/components/admin/Add_Interest_Widget */

const addSchema = new SimpleSchema({
  name: { type: String, optional: false },
  slug: { type: String, optional: false, custom: FormUtils.slugFieldValidator },
  description: { type: String, optional: false },
  interestType: { type: String, optional: false, minCount: 1 },
  moreInformation: { type: String, optional: false },
});

Template.Add_Interest_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Interest_Widget.helpers({
  interestTypes() {
    return InterestTypes.find({}, { sort: { name: 1 } });
  },
});

Template.Add_Interest_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.resetValidation();
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      Interests.define(newData);
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
});

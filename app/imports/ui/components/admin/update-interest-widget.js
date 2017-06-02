import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { interestsUpdateMethod } from '../../../api/interest/InterestCollection.methods';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Update_Interest_Widget */

const updateSchema = new SimpleSchema({
  name: { type: String, optional: false },
  description: { type: String, optional: false },
  interestType: { type: String, optional: false, minCount: 1 },
});

Template.Update_Interest_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Interest_Widget.helpers({
  interest() {
    return Interests.findDoc(Template.currentData().updateID.get());
  },
  slug() {
    const interest = Interests.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(interest.slugID).name;
  },
  interestTypes() {
    return InterestTypes.find({}, { sort: { name: 1 } });
  },
});

Template.Update_Interest_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updatedData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.resetValidation();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      FormUtils.renameKey(updatedData, 'interestType', 'interestTypeID');
      updatedData.id = instance.data.updateID.get();
      console.log(updatedData);
      interestsUpdateMethod.call(updatedData, (error) => {
        if (error) {
          console.log('Error updating Interest', error);
          FormUtils.indicateError(instance);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
